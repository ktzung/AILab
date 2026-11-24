/* AILab — Nền tảng AI · bài 5–9 */
(function () {
  "use strict";
  const L = window.AILAB.lessons;
  const S = {
    flow(steps, active, done) { return { kind: "flow", steps, active: active || [], done: done || [] }; },
    graph(nodes, edges, caption) { return { kind: "graph", nodes, edges, caption }; },
    tree(nodes, edges, caption) { return { kind: "tree", nodes, edges, caption }; },
    table(headers, rows, activeRow, caption) { return { kind: "table", headers, rows, activeRow, caption }; },
    big(rows, caption) { return { kind: "complexity", rows, caption }; }
  };

  L["alpha-beta"] = {
    id: "alpha-beta",
    track: "ai",
    module: "ai-games",
    title: "Cắt tỉa alpha–beta",
    shortTitle: "Alpha–beta",
    subtitle: "Không cần xem nhánh nào chắc chắn không đổi được quyết định.",
    blurb: "Minimax đúng nhưng tốn. Alpha–beta giữ nguyên kết quả, bỏ những nhánh đã biết là vô ích — cùng nước đi, ít phép tính hơn.",
    level: "Trung cấp",
    duration: "15 phút",
    tags: ["alpha-beta", "cắt tỉa", "minimax", "tối ưu"],
    learn: [
      "alpha là điểm tốt nhất MAX đã bảo đảm",
      "beta là điểm tốt nhất MIN đã bảo đảm",
      "Khi alpha >= beta, nhánh còn lại không thể đổi kết quả",
      "Cắt tỉa không làm mất nước đi tối ưu"
    ],
    code: `def alphabeta(node, a, b, me):
    if node.leaf:
        return score(node)
    if me:
        for c in node.kids:
            a = max(a, alphabeta(c, a, b, False))
            if a >= b: break
        return a
    for c in node.kids:
        b = min(b, alphabeta(c, a, b, True))
        if b <= a: break
    return b`,
    file: "alphabeta.py",
    life: {
      icon: "tree",
      title: "Bỏ qua phương án đã biết kém",
      text: "Bạn đang chọn quán ăn. Mới xem hai quán đã thấy một quán 8 điểm. Quán thứ ba vừa vào đã dở hơn 8 ở món khai vị, nên không cần ăn hết thực đơn để kết luận. Đó chính là cắt tỉa."
    },
    steps: [
      {
        short: "Vì sao cắt",
        type: "BẮT ĐẦU",
        title: "Cùng câu hỏi, bớt việc thừa",
        body: "Alpha–beta chạy đúng minimax nhưng dừng sớm một nhánh khi đã chứng minh nhánh đó không thể tốt hơn lựa chọn hiện có. Kết quả cuối cùng không đổi.",
        line: 1,
        mark: [1],
        watch: [{ name: "alpha", value: "-∞", type: "MAX" }, { name: "beta", value: "+∞", type: "MIN" }],
        output: "",
        visual: S.tree([
          { id: "A", x: 330, y: 50, state: "active", label: "A" },
          { id: "B", x: 180, y: 150, label: "B" }, { id: "C", x: 480, y: 150, label: "C" },
          { id: "D", x: 90, y: 250, label: "3" }, { id: "E", x: 210, y: 250, label: "5" },
          { id: "F", x: 390, y: 250, label: "2" }, { id: "G", x: 510, y: 250, label: "9" }
        ], [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"], ["C", "G"]], "Cây mẫu: MAX ở A, MIN ở B và C")
      },
      {
        short: "Hai mốc",
        type: "ĐỊNH NGHĨA",
        title: "alpha và beta là hai lời hứa",
        body: "alpha là điểm thấp nhất MAX chắc chắn đạt được. beta là điểm cao nhất MIN chắc chắn cho phép. Nếu alpha vượt beta, hai bên không còn thương lượng được nữa.",
        line: 6,
        mark: [6, 7],
        watch: [{ name: "alpha", value: "3", type: "sau nhánh B" }, { name: "beta", value: "+∞", type: "tại C" }],
        output: "",
        visual: S.table(["Khái niệm", "Do ai giữ", "Ý nghĩa"], [
          ["alpha", "MAX", "điểm tốt nhất đã bảo đảm"],
          ["beta", "MIN", "điểm tốt nhất đối thủ chấp nhận"],
          ["alpha >= beta", "cả hai", "nhánh này không còn đáng xem"]
        ], 0, "Hai mốc được truyền xuống khi đi sâu")
      },
      {
        short: "Duyệt B",
        type: "LAN NGƯỢC",
        title: "B chốt giá trị 3, alpha = 3",
        body: "MIN tại B chọn min(3, 5) = 3. MAX tại A biết ít nhất mình được 3, nên alpha nâng lên 3 trước khi xem nhánh C.",
        line: 7,
        mark: [7],
        watch: [{ name: "B", value: "3", type: "MIN" }, { name: "alpha", value: "3", type: "MAX" }],
        output: "",
        visual: S.tree([
          { id: "A", x: 330, y: 50, state: "active", badge: "α3", label: "A" },
          { id: "B", x: 180, y: 150, state: "done", badge: "3", label: "B" },
          { id: "C", x: 480, y: 150, state: "open", label: "C" },
          { id: "D", x: 90, y: 250, state: "done", label: "3" }, { id: "E", x: 210, y: 250, state: "done", label: "5" },
          { id: "F", x: 390, y: 250, label: "2" }, { id: "G", x: 510, y: 250, label: "9" }
        ], [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"], ["C", "G"]], "Sau nhánh B, MAX đã có sàn 3 điểm")
      },
      {
        short: "Cắt G",
        type: "CẮT TỈA",
        title: "F = 2 đủ để bỏ luôn G",
        body: "Tại C, MIN vừa thấy lá F = 2, nên beta = 2. Vì alpha = 3 >= beta = 2, MIN chắc chắn không cho MAX quá 2 ở nhánh này. Xem G cũng vô ích.",
        line: 10,
        mark: [10, 11],
        watch: [{ name: "beta", value: "2", type: "tại C" }, { name: "alpha >= beta", value: "3 >= 2", type: "cắt" }],
        output: "",
        visual: S.tree([
          { id: "A", x: 330, y: 50, state: "active", badge: "α3", label: "A" },
          { id: "B", x: 180, y: 150, state: "done", badge: "3", label: "B" },
          { id: "C", x: 480, y: 150, state: "open", badge: "β2", label: "C" },
          { id: "D", x: 90, y: 250, state: "done", label: "3" }, { id: "E", x: 210, y: 250, state: "done", label: "5" },
          { id: "F", x: 390, y: 250, state: "done", label: "2" }, { id: "G", x: 510, y: 250, state: "dim", label: "9" }
        ], [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"], ["C", "G"]], "G bị bỏ qua dù chưa đọc")
      },
      {
        short: "Kết luận",
        type: "KẾT THÚC",
        title: "Cùng đáp án, ít lá hơn",
        body: "Minimax đọc cả 4 lá. Alpha–beta chỉ đọc 3 lá trong ví dụ này, và trong cây lớn có thể bỏ gần một nửa số nhánh nếu thứ tự duyệt tốt. Nước đi tối ưu vẫn là B.",
        line: 5,
        mark: [5],
        watch: [{ name: "lá đã đọc", value: "3 / 4", type: "tiết kiệm" }, { name: "nước đi", value: "A → B", type: "không đổi" }],
        output: "B",
        tone: "final",
        visual: S.table(["Thuật toán", "Lá đọc", "Kết quả", "Ghi chú"], [
          ["Minimax", "4", "3", "đọc toàn bộ cây"],
          ["Alpha–beta", "3", "3", "bỏ nhánh không thể đổi kết quả"],
          ["Alpha–beta, thứ tự tốt", "2", "3", "cắt mạnh hơn nữa"]
        ], 1, "Cắt tỉa không hy sinh tính đúng")
      }
    ]
  };

  L.csp = {
    id: "csp",
    track: "ai",
    module: "ai-games",
    title: "Bài toán thỏa ràng buộc (CSP)",
    shortTitle: "CSP",
    subtitle: "Bài toán không phải tìm đường, mà gán giá trị sao cho mọi ràng buộc cùng đúng.",
    blurb: "Xếp lịch thi, chia ca, tô màu bản đồ, Sudoku: cùng một khuôn — biến, miền giá trị và ràng buộc. Lời giải là một phép gán nhất quán.",
    level: "Trung cấp",
    duration: "16 phút",
    tags: ["CSP", "ràng buộc", "backtracking", "Sudoku", "xếp lịch"],
    learn: [
      "CSP gồm biến, miền giá trị và ràng buộc",
      "Lời giải là phép gán đầy đủ, nhất quán",
      "Backtracking thử rồi lùi khi bế tắc",
      "Kiểm tra sớm và chọn biến khó trước giúp cắt nhánh"
    ],
    code: `vars = [A, B, C]
domains = {v: times for v in vars}
def backtrack(assign):
    if len(assign) == len(vars):
        return assign
    v = pick_unassigned(assign)
    for value in domains[v]:
        if consistent(assign, v, value):
            assign[v] = value
            result = backtrack(assign)
            if result: return result
            del assign[v]
    return None`,
    file: "csp.py",
    life: {
      icon: "bulb",
      title: "Xếp ba lớp vào ba ca",
      text: "Ba lớp cần ba ca khác nhau, lớp A không học ca sáng thứ Hai, lớp C phải sau 9 giờ. Không có công thức tính thẳng; ta thử, kiểm tra ràng buộc và lùi khi kẹt."
    },
    steps: [
      {
        short: "Ba thành phần",
        type: "BẮT ĐẦU",
        title: "Biến, miền giá trị, ràng buộc",
        body: "Mỗi lớp là một biến; mỗi ca là một giá trị có thể gán; các điều kiện như khác ca hay khác buổi là ràng buộc. Ràng buộc nối các biến thành một mạng.",
        line: 1,
        mark: [1, 2],
        watch: [{ name: "biến", value: "A, B, C", type: "lớp" }, { name: "miền", value: "3 ca", type: "giá trị" }],
        output: "",
        visual: S.graph([
          { id: "A", x: 180, y: 80, label: "A" },
          { id: "B", x: 100, y: 230, label: "B" },
          { id: "C", x: 300, y: 230, label: "C" }
        ], [
          { from: "A", to: "B", weight: "≠" },
          { from: "B", to: "C", weight: "≠" },
          { from: "A", to: "C", weight: "≠" }
        ], "Ràng buộc khác ca nối cả ba lớp")
      },
      {
        short: "Ràng buộc",
        type: "MÔ HÌNH",
        title: "Mỗi ràng buộc thu hẹp lựa chọn",
        body: "Ngoài khác ca, lớp A không nhận ca sáng thứ Hai; lớp C chỉ nhận ca sau 9 giờ. Miền giá trị của từng biến nhỏ lại, và lời giải phải thỏa tất cả cùng lúc.",
        line: 2,
        mark: [2],
        watch: [{ name: "A", value: "{Ca 1, Ca 2}", type: "miền" }, { name: "C", value: "{Ca 2, Ca 3}", type: "miền" }],
        output: "",
        visual: S.table(["Biến", "Miền ban đầu", "Ràng buộc riêng"], [
          ["A", "Ca 1, Ca 2, Ca 3", "không phải sáng thứ Hai"],
          ["B", "Ca 1, Ca 2, Ca 3", "khác ca với A và C"],
          ["C", "Ca 1, Ca 2, Ca 3", "chỉ ca sau 9 giờ"]
        ], 0, "Miền bị lọc trước khi thử")
      },
      {
        short: "Thử",
        type: "GÁN",
        title: "Gán từng biến và kiểm tra ngay",
        body: "Chọn A = Ca 1, kiểm tra được. Chọn B = Ca 1, vi phạm vì trùng A. Backtrack thử B = Ca 2, được. Mỗi lần gán đều kiểm tra với các biến đã gán.",
        line: 7,
        mark: [7, 8, 9],
        watch: [{ name: "A", value: "Ca 1", type: "đã gán" }, { name: "B", value: "Ca 2", type: "đã gán" }],
        output: "",
        visual: S.table(["Bước", "Phép gán", "Kiểm tra"], [
          ["1", "A = Ca 1", "hợp lệ"],
          ["2", "B = Ca 1", "trùng A, loại"],
          ["3", "B = Ca 2", "hợp lệ"],
          ["4", "C = ?", "còn một ca"]
        ], 2, "Thử xong mới biết, nhưng kiểm tra rẻ hơn làm thật")
      },
      {
        short: "Quay lui",
        type: "LÙI",
        title: "Bế tắc thì bỏ giá trị vừa gán",
        body: "Nếu C không còn ca nào hợp lệ, backtrack xóa B rồi thử giá trị khác. Không cần quay lại A nếu A vẫn còn khả năng. Đây là tìm kiếm có nhớ ràng buộc.",
        line: 11,
        mark: [11, 12],
        watch: [{ name: "assign", value: "{A: Ca 1, B: Ca 2}", type: "nháp" }, { name: "hành động", value: "xóa B, thử Ca 3", type: "lùi" }],
        output: "",
        visual: S.flow([{ label: "A = Ca 1", sub: "chắc chắn" }, { label: "B = Ca 2", sub: "thử" }, { label: "C không còn ca", sub: "bế tắc" }, { label: "Lùi B", sub: "thử Ca 3" }], [3], [0, 1])
      },
      {
        short: "Kết luận",
        type: "KẾT THÚC",
        title: "Lời giải: A Ca 1, B Ca 3, C Ca 2",
        body: "Khác ca đôi một, A tránh sáng thứ Hai, C sau 9 giờ. Với bài lớn, chọn biến ít lựa chọn trước (MRV) và lan truyền ràng buộc giúp giảm mạnh số nhánh phải thử.",
        line: 4,
        mark: [4, 5],
        watch: [{ name: "A", value: "Ca 1", type: "lời giải" }, { name: "B", value: "Ca 3", type: "lời giải" }, { name: "C", value: "Ca 2", type: "lời giải" }],
        output: "A=1 B=3 C=2",
        tone: "final",
        visual: S.table(["Lớp", "Ca", "Kiểm tra ràng buộc"], [
          ["A", "Ca 1", "không sáng thứ Hai, khác B và C"],
          ["B", "Ca 3", "khác A và C"],
          ["C", "Ca 2", "sau 9 giờ, khác A và B"]
        ], 0, "Một phép gán đầy đủ và nhất quán")
      }
    ]
  };

  L["local-search"] = {
    id: "local-search",
    track: "ai",
    module: "ai-games",
    title: "Tìm kiếm cục bộ: leo đồi",
    shortTitle: "Leo đồi",
    subtitle: "Khi không gian quá lớn để duyệt, đi từ lời giải tạm sang lời giải tốt hơn gần đó.",
    blurb: "Bài toán tối ưu như lập tuyến giao hàng có quá nhiều phương án. Leo đồi không tìm toàn cục bằng cách duyệt hết, mà cải thiện dần từ một phương án hiện có.",
    level: "Trung cấp",
    duration: "15 phút",
    tags: ["leo đồi", "tối ưu", "láng giềng", "cực trị địa phương"],
    learn: [
      "Bắt đầu từ một lời giải bất kỳ",
      "Chỉ xét các láng giềng gần",
      "Dừng khi không láng giềng nào tốt hơn",
      "Có thể kẹt ở cực trị địa phương"
    ],
    code: `route = random_order(cities)
while True:
    best = route
    for neighbor in swaps(route):
        if cost(neighbor) < cost(best):
            best = neighbor
    if best == route:
        return route
    route = best`,
    file: "hill_climb.py",
    life: {
      icon: "bulb",
      title: "Sắp lại lịch giao hàng",
      text: "Bạn có sẵn một tuyến, thử đổi hai điểm giao cho nhau. Nếu tổng quãng đường giảm, giữ thay đổi; nếu không, thử cặp khác. Rất nhanh, nhưng có thể dừng ở phương án chỉ tốt trong vùng lân cận."
    },
    steps: [
      {
        short: "Vì sao không duyệt",
        type: "BẮT ĐẦU",
        title: "6 thành phố đã có 60 tuyến khác nhau",
        body: "Với n thành phố, số vòng đi là (n-1)!/2. n = 10 đã hơn 180 nghìn, n = 20 vượt hàng triệu tỉ. Không thể thử hết, phải cải thiện dần.",
        line: 1,
        mark: [1],
        watch: [{ name: "n", value: "6", type: "thành phố" }, { name: "tuyến", value: "60", type: "tổ hợp" }],
        output: "",
        visual: S.big([
          { label: "n = 6", text: "60 tuyến", value: 8 },
          { label: "n = 10", text: "≈ 181.000 tuyến", value: 40 },
          { label: "n = 20", text: "≈ 6·10^16 tuyến", value: 95, active: true }
        ], "Số tuyến tăng theo giai thừa")
      },
      {
        short: "Xuất phát",
        type: "KHỞI TẠO",
        title: "Nhận một tuyến bất kỳ làm điểm xuất phát",
        body: "Leo đồi không cần điểm xuất phát tốt. Nó chỉ cần một lời giải hợp lệ rồi hỏi: đổi hai thành phố có làm tổng quãng đường ngắn hơn không?",
        line: 1,
        mark: [1],
        watch: [{ name: "route", value: "A B C D E F", type: "tuyến" }, { name: "cost", value: "38 km", type: "tổng" }],
        output: "",
        visual: S.graph([
          { id: "A", x: 90, y: 75, state: "active" }, { id: "B", x: 230, y: 55 },
          { id: "C", x: 370, y: 95 }, { id: "D", x: 390, y: 235 },
          { id: "E", x: 240, y: 275 }, { id: "F", x: 90, y: 225 }
        ], [
          { from: "A", to: "B", weight: 6, state: "active" },
          { from: "B", to: "C", weight: 7, state: "active" },
          { from: "C", to: "D", weight: 8, state: "active" },
          { from: "D", to: "E", weight: 5, state: "active" },
          { from: "E", to: "F", weight: 6, state: "active" },
          { from: "F", to: "A", weight: 6, state: "active" }
        ], "Tuyến ban đầu: đi vòng theo thứ tự")
      },
      {
        short: "Láng giềng",
        type: "CẢI THIỆN",
        title: "Đổi chỗ hai thành phố, giữ nếu tốt hơn",
        body: "Mỗi láng giềng là một tuyến chỉ khác tuyến hiện tại ở hai vị trí. Nếu quãng đường giảm, tuyến đó thành điểm đứng mới; nếu không, thử cặp khác.",
        line: 4,
        mark: [4, 5, 6],
        watch: [{ name: "hiện tại", value: "38 km", type: "cost" }, { name: "tốt nhất", value: "33 km", type: "sau khi đổi" }],
        output: "",
        visual: S.table(["Láng giềng", "Thay đổi", "Tổng km"], [
          ["A B C E D F", "đổi D và E", "33"],
          ["A B D C E F", "đổi C và D", "36"],
          ["A C B D E F", "đổi B và C", "40"],
          ["A B C D F E", "đổi E và F", "37"]
        ], 0, "Chỉ cần xét các cặp gần, không cần toàn bộ không gian")
      },
      {
        short: "Kẹt",
        type: "PHÂN TÍCH",
        title: "Không còn láng giềng tốt hơn chưa chắc là tối ưu",
        body: "Leo đồi dừng ở đỉnh gần nhất. Đỉnh đó có thể là cực trị địa phương: mọi bước nhỏ đều xấu hơn, nhưng một bước lớn ở xa lại tốt hơn nhiều.",
        line: 7,
        mark: [7, 8],
        watch: [{ name: "trạng thái", value: "đứng yên", type: "dừng" }, { name: "rủi ro", value: "cực trị địa phương", type: "hạn chế" }],
        output: "",
        visual: S.big([
          { label: "Toàn cục", text: "lời giải tốt nhất", value: 100 },
          { label: "Địa phương", text: "đỉnh gần, không lối xuống", value: 62, active: true },
          { label: "Khởi đầu khác", text: "có thể rơi vào đỉnh khác", value: 35 }
        ], "Độ cao là chất lượng lời giải; chấm sáng là vị trí đang đứng")
      },
      {
        short: "Kết luận",
        type: "KẾT THÚC",
        title: "Nhanh, đơn giản, cần thêm ngẫu nhiên",
        body: "Leo đồi rất hợp khi một lời giải đủ tốt được phép. Để thoát cực trị địa phương, người ta thêm khởi động lại ngẫu nhiên hoặc thỉnh thoảng nhận bước xấu (ủ thép mô phỏng).",
        line: 8,
        mark: [8],
        watch: [{ name: "tuyến", value: "A B C E D F", type: "sau cải thiện" }, { name: "chi phí", value: "33 km", type: "tốt hơn 38" }],
        output: "A B C E D F",
        tone: "final",
        visual: S.table(["Chiến lược", "Có thoát cực trị?", "Chi phí"], [
          ["Leo đồi", "không", "rất thấp"],
          ["Khởi động lại ngẫu nhiên", "có, nhờ may mắn", "thấp"],
          ["Ủ thép mô phỏng", "có, nhận bước xấu", "trung bình"]
        ], 0, "Chọn theo mức độ cần tối ưu")
      }
    ]
  };

  L.bayes = {
    id: "bayes",
    track: "ai",
    module: "ai-reason",
    title: "Suy luận Bayes: cập nhật niềm tin",
    shortTitle: "Định lý Bayes",
    subtitle: "Xác suất trước gặp bằng chứng mới, trở thành xác suất sau.",
    blurb: "Xét nghiệm hiếm bệnh cho kết quả dương tính. Vì sao bác sĩ vẫn chưa kết luận? Định lý Bayes giải thích bằng số, và chỉ ra lỗi bỏ qua tỉ lệ nền.",
    level: "Cơ bản",
    duration: "16 phút",
    tags: ["Bayes", "xác suất", "prior", "posterior", "base rate"],
    learn: [
      "Prior là niềm tin trước khi thấy bằng chứng",
      "Likelihood là khả năng bằng chứng xuất hiện",
      "Posterior tỉ lệ với prior nhân likelihood",
      "Tỉ lệ nền nhỏ khiến dương tính chưa đủ kết luận"
    ],
    code: `prior = 0.01
p_pos_given_sick = 0.99
p_pos_given_healthy = 0.05
p_sick_and_pos = prior * p_pos_given_sick
p_healthy_and_pos = (1 - prior) * p_pos_given_healthy
posterior = p_sick_and_pos / (p_sick_and_pos + p_healthy_and_pos)`,
    file: "bayes.py",
    life: {
      icon: "bulb",
      title: "Chuông báo động giả",
      text: "Một chuông báo cháy kêu. Bạn tin có cháy hay tin chuông hỏng? Nếu chuông hiếm khi kêu và hiếm khi hỏng, tiếng kêu là bằng chứng mạnh. Nếu chuông hay kêu vì hơi nước, bằng chứng yếu đi. Bayes cân hai điều đó."
    },
    steps: [
      {
        short: "Prior",
        type: "BẮT ĐẦU",
        title: "Trước khi xét nghiệm, khả năng bệnh là 1%",
        body: "Trong 10.000 người cùng độ tuổi, khoảng 100 người mắc bệnh. Đó là prior: chưa có bằng chứng gì thêm, xác suất mắc là 0,01.",
        line: 1,
        mark: [1],
        watch: [{ name: "prior", value: "0.01", type: "1%" }, { name: "dân số", value: "10.000", type: "mẫu" }],
        output: "",
        visual: S.table(["Nhóm", "Số người", "Tỉ lệ"], [
          ["Mắc bệnh", "100", "1%"],
          ["Khỏe mạnh", "9.900", "99%"],
          ["Tổng", "10.000", "100%"]
        ], 0, "Tỉ lệ nền quyết định phần lớn kết quả")
      },
      {
        short: "Likelihood",
        type: "BẰNG CHỨNG",
        title: "Xét nghiệm bắt được 99% ca bệnh, nhưng báo nhầm 5% ca khỏe",
        body: "Độ nhạy 99% nghĩa là người bệnh có 99% khả năng dương tính. Dương tính giả 5% nghĩa là người khỏe vẫn có 5% khả năng bị báo dương.",
        line: 2,
        mark: [2, 3],
        watch: [{ name: "P(+ | bệnh)", value: "0.99", type: "độ nhạy" }, { name: "P(+ | khỏe)", value: "0.05", type: "dương giả" }],
        output: "",
        visual: S.table(["Tình trạng", "Số người", "Dương tính", "Số dương"], [
          ["Mắc bệnh", "100", "99%", "99"],
          ["Khỏe mạnh", "9.900", "5%", "495"]
        ], 1, "Cùng một xét nghiệm, hai nhóm cho số dương rất khác")
      },
      {
        short: "Đếm",
        type: "TÍNH",
        title: "594 người dương tính, chỉ 99 người thật sự bệnh",
        body: "Nhóm khỏe đông gấp 99 lần, nên dù tỉ lệ dương giả chỉ 5%, số dương giả vẫn gấp 5 lần số dương thật. Đây là điều trực giác thường bỏ sót.",
        line: 4,
        mark: [4, 5],
        watch: [{ name: "dương thật", value: "99", type: "bệnh" }, { name: "dương giả", value: "495", type: "khỏe" }],
        output: "",
        visual: S.big([
          { label: "Dương thật", text: "99 người", value: 20 },
          { label: "Dương giả", text: "495 người", value: 100, active: true },
          { label: "Tổng dương", text: "594 người", value: 120 }
        ], "Trong số dương tính, phần lớn đến từ nhóm khỏe mạnh")
      },
      {
        short: "Posterior",
        type: "CẬP NHẬT",
        title: "Xác suất mắc bệnh sau dương tính là 16,7%",
        body: "99 / 594 ≈ 0,167. Niềm tin tăng từ 1% lên gần 17%, nhưng vẫn chưa đủ để kết luận. Cần xét nghiệm lại hoặc thêm triệu chứng để có bằng chứng độc lập.",
        line: 6,
        mark: [6],
        watch: [{ name: "posterior", value: "0.167", type: "16,7%" }, { name: "so với prior", value: "1% → 16,7%", type: "cập nhật" }],
        output: "0.167",
        visual: S.table(["Kết quả", "Công thức", "Giá trị"], [
          ["P(bệnh)", "0.01", "1%"],
          ["P(+ | bệnh)", "0.99", "99%"],
          ["P(+ | khỏe)", "0.05", "5%"],
          ["P(bệnh | +)", "99 / 594", "16,7%"]
        ], 3, "Posterior là tỉ lệ dương thật trong toàn bộ dương tính")
      },
      {
        short: "Kết luận",
        type: "KẾT THÚC",
        title: "Bằng chứng mạnh đến đâu còn phụ thuộc niềm tin ban đầu",
        body: "Cùng kết quả dương tính, nếu người đó thuộc nhóm nguy cơ cao 10% thì posterior tăng lên hơn 68%. Vì vậy hệ AI chẩn đoán phải biết tỉ lệ nền, không chỉ độ chính xác của mô hình.",
        line: 6,
        mark: [6],
        watch: [{ name: "prior 10%", value: "posterior ≈ 68,8%", type: "nguy cơ cao" }, { name: "prior 1%", value: "posterior ≈ 16,7%", type: "cộng đồng" }],
        output: "",
        tone: "final",
        visual: S.big([
          { label: "Prior 1%", text: "posterior 16,7%", value: 17 },
          { label: "Prior 10%", text: "posterior 68,8%", value: 69, active: true },
          { label: "Prior 50%", text: "posterior 95,2%", value: 95 }
        ], "Cùng xét nghiệm, cùng dương tính, khác nhóm thì khác kết luận")
      }
    ]
  };

  L.mdp = {
    id: "mdp",
    track: "ai",
    module: "ai-reason",
    title: "Quyết định Markov (MDP)",
    shortTitle: "MDP",
    subtitle: "Phần thưởng đến sau nhiều bước, và mỗi hành động có thể thất bại.",
    blurb: "Robot hút bụi, xe tự lái, gợi ý nội dung: hành động hôm nay ảnh hưởng trạng thái mai sau. MDP cho một cách tính giá trị dài hạn thay vì chỉ nhìn phần thưởng trước mắt.",
    level: "Nâng cao",
    duration: "18 phút",
    tags: ["MDP", "Markov", "value iteration", "chính sách", "chiết khấu"],
    learn: [
      "Trạng thái Markov gói đủ thông tin để quyết định",
      "Giá trị V(s) là tổng phần thưởng tương lai có chiết khấu",
      "Value iteration cập nhật V cho tới khi hội tụ",
      "Chính sách là hành động tốt nhất tại mỗi trạng thái"
    ],
    code: `V = {s: 0 for s in states}
repeat:
    for s in states:
        V[s] = max(R(s, a) + gamma * V[next(s, a)]
                   for a in actions)
until V stops changing
policy = argmax over actions`,
    file: "mdp.py",
    life: {
      icon: "bulb",
      title: "Học qua thử và sai",
      text: "Bạn chơi một trò nhiều màn. Đi nhanh có thể rơi hố nhưng qua màn; đi chậm an toàn nhưng hết giờ. Giá trị của một nước không nằm ở điểm trước mắt mà ở tổng điểm về sau, chiết khấu theo độ xa."
    },
    steps: [
      {
        short: "Phần thưởng",
        type: "BẮT ĐẦU",
        title: "Mỗi bước đi có thưởng, phạt và xác suất",
        body: "Từ S đi sang A được +2, sang B bị -1. Hành động không chắc thành công: có thể trượt sang ô bên cạnh. MDP mô tả cả phần thưởng lẫn xác suất chuyển.",
        line: 1,
        mark: [1],
        watch: [{ name: "R(S→A)", value: "+2", type: "thưởng" }, { name: "R(S→B)", value: "-1", type: "phạt" }, { name: "gamma", value: "0.9", type: "chiết khấu" }],
        output: "",
        visual: S.graph([
          { id: "S", x: 80, y: 160, state: "active", label: "S" },
          { id: "A", x: 230, y: 80, label: "A" }, { id: "B", x: 230, y: 240, label: "B" },
          { id: "C", x: 390, y: 80, label: "C" }, { id: "G", x: 530, y: 160, label: "G" }
        ], [
          { from: "S", to: "A", weight: "+2", state: "active" },
          { from: "S", to: "B", weight: "-1" },
          { from: "A", to: "C", weight: "+1" },
          { from: "B", to: "C", weight: "-2" },
          { from: "C", to: "G", weight: "+10" }
        ], "Số trên cạnh là phần thưởng tức thời")
      },
      {
        short: "Giá trị",
        type: "ĐỊNH NGHĨA",
        title: "Giá trị của trạng thái gồm cả tương lai",
        body: "V(s) = thưởng ngay + gamma × giá trị trạng thái tiếp theo. gamma gần 1 nghĩa là quan tâm dài hạn; gamma nhỏ nghĩa là chỉ nhìn vài bước.",
        line: 4,
        mark: [4],
        watch: [{ name: "V(C)", value: "9", type: "0.9 × 10" }, { name: "V(A)", value: "1 + 0.9 × 9 = 9.1", type: "tính ngược" }],
        output: "",
        visual: S.table(["Trạng thái", "Thưởng ngay", "Giá trị tương lai", "V"], [
          ["G", "0", "0", "0"],
          ["C", "+10", "0.9 × 0", "10"],
          ["A", "+1", "0.9 × 10", "10"],
          ["B", "-2", "0.9 × 10", "7"],
          ["S", "+2", "0.9 × 10", "11"]
        ], 4, "Tính từ trạng thái gần đích ngược về đầu")
      },
      {
        short: "Lặp",
        type: "HỘI TỤ",
        title: "Lặp giá trị cho tới khi ổn định",
        body: "Khởi tạo V = 0 rồi cập nhật đồng loạt. Sau vài vòng, V hội tụ vì gamma < 1 làm ảnh hưởng của bước xa giảm dần. Không cần biết chính sách trước.",
        line: 2,
        mark: [2, 3],
        watch: [{ name: "vòng 1", value: "V(C)=10", type: "mới" }, { name: "vòng 2", value: "V(A)=10, V(B)=7", type: "lan" }],
        output: "",
        visual: S.table(["Vòng", "V(S)", "V(A)", "V(B)", "V(C)"], [
          ["0", "0", "0", "0", "0"],
          ["1", "2", "1", "-2", "10"],
          ["2", "11", "10", "7", "10"],
          ["3", "11", "10", "7", "10"]
        ], 2, "V không đổi nữa là đã hội tụ")
      },
      {
        short: "Chính sách",
        type: "CHỌN",
        title: "Mỗi trạng thái có một hành động tốt nhất",
        body: "Tại S, đi A cho 2 + 0,9×10 = 11; đi B cho -1 + 0,9×10 = 8. Chính sách tối ưu chọn A. Đây là kết quả cuối cùng cần lưu, không phải bảng V.",
        line: 6,
        mark: [6],
        watch: [{ name: "S → A", value: "11", type: "tốt nhất" }, { name: "S → B", value: "8", type: "kém hơn" }],
        output: "",
        visual: S.graph([
          { id: "S", x: 80, y: 160, state: "active", badge: "11", label: "S" },
          { id: "A", x: 230, y: 80, state: "done", badge: "10", label: "A" },
          { id: "B", x: 230, y: 240, state: "dim", badge: "7", label: "B" },
          { id: "C", x: 390, y: 80, state: "done", badge: "10", label: "C" },
          { id: "G", x: 530, y: 160, state: "done", badge: "0", label: "G" }
        ], [{ from: "S", to: "A", weight: "+2", state: "active" }, { from: "A", to: "C", weight: "+1", state: "done" }, { from: "C", to: "G", weight: "+10", state: "done" }, { from: "S", to: "B", weight: "-1", state: "dim" }, { from: "B", to: "C", weight: "-2", state: "dim" }], "Mũi tên đậm là hành động chính sách chọn")
      },
      {
        short: "Kết luận",
        type: "KẾT THÚC",
        title: "Giá trị dài hạn, không phải tham lam từng bước",
        body: "MDP là khuôn cho học tăng cường: tác tử không biết trước mô hình, phải thử để ước lượng V rồi cải thiện chính sách. Q-learning và policy gradient đều dựa trên ý tưởng này.",
        line: 4,
        mark: [4, 6],
        watch: [{ name: "chính sách", value: "S→A, A→C, C→G", type: "tối ưu" }, { name: "giá trị S", value: "11", type: "dài hạn" }],
        output: "S A C G",
        tone: "final",
        visual: S.flow([{ label: "Trạng thái", sub: "quan sát" }, { label: "Hành động", sub: "chính sách" }, { label: "Phần thưởng", sub: "tín hiệu" }, { label: "Giá trị", sub: "học dần" }], [3], [0, 1, 2])
      }
    ]
  };
})();
