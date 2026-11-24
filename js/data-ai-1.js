/* AILab — Nền tảng AI · bài 1–4 */
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

  L.agents = {
    id: "agents",
    track: "ai",
    module: "ai-search",
    title: "Tác tử: cảm nhận, quyết định, hành động",
    shortTitle: "Tác tử",
    subtitle: "AI không phải một câu trả lời, mà một vòng lặp hành vi trong môi trường.",
    blurb: "Trước khi nói đến thuật toán, cần biết ai đang hành động, thấy được gì và chịu ràng buộc nào. Đó là mô hình tác tử.",
    level: "Cơ bản",
    duration: "14 phút",
    tags: ["tác tử", "agent", "môi trường", "rational", "vòng lặp"],
    learn: [
      "Tác tử nhận tri giác, cập nhật trạng thái rồi chọn hành động",
      "Môi trường quyết định bài toán khó hay dễ",
      "Hành vi hợp lý là tối đa kết quả kỳ vọng, không phải luôn đúng",
      "Bốn kiểu tác tử: phản xạ, mô hình, mục tiêu, lợi ích"
    ],
    code: `while True:
    percept = sense(env)
    state = update(state, percept)
    action = policy(state)
    if action is None:
        break
    env = act(action)`,
    file: "agent_loop.py",
    life: {
      icon: "bulb",
      title: "Người lái xe trong mưa",
      text: "Bạn không thấy toàn bộ con đường, chỉ thấy qua kính, gương và tiếng động. Mỗi giây bạn cập nhật hình dung rồi đánh lái. Tác tử cũng vậy: không cần biết tất cả, chỉ cần hành động tốt với những gì cảm nhận được."
    },
    steps: [
      {
        short: "Vòng lặp",
        type: "BẮT ĐẦU",
        title: "Một chu kỳ nhận thức và hành động",
        body: "Tác tử đọc môi trường qua giác quan, lưu điều đã biết vào trạng thái, rồi chọn hành động. Hành động lại làm môi trường đổi, mở ra chu kỳ tiếp theo.",
        line: 2,
        mark: [2, 3, 4, 7],
        watch: [{ name: "percept", value: "pin yếu", type: "giác quan" }, { name: "action", value: "tìm ổ sạc", type: "hành động" }],
        output: "",
        visual: S.flow([{ label: "Môi trường", sub: "thế giới" }, { label: "Cảm nhận", sub: "sensor" }, { label: "Trạng thái", sub: "điều đã biết" }, { label: "Hành động", sub: "actuator" }], [1], []),
        changes: ["Đọc tri giác mới.", "Cập nhật trạng thái.", "Chọn hành động."]
      },
      {
        short: "Trạng thái",
        type: "MÔ HÌNH",
        title: "Trạng thái là niềm tin, không phải sự thật",
        body: "Cảm biến có nhiễu, nên trạng thái chỉ là hình dung tốt nhất. Tác tử mô hình giữ lại lịch sử để suy ra điều đang bị che khuất.",
        line: 3,
        mark: [3],
        watch: [{ name: "state", value: "pin 12% + đã thấy ổ sạc", type: "niềm tin" }, { name: "bộ nhớ", value: "3 quan sát", type: "lịch sử" }],
        output: "",
        visual: S.flow([{ label: "Tri giác nhiễu", sub: "pin 12%?" }, { label: "Cập nhật", sub: "lọc nhiễu" }, { label: "Trạng thái", sub: "pin khoảng 10–15%" }, { label: "Hành động", sub: "sạc trước" }], [2], [0, 1]),
        changes: ["Gộp tri giác mới vào niềm tin cũ."]
      },
      {
        short: "Môi trường",
        type: "PHÂN TÍCH",
        title: "Cùng thuật toán, môi trường khác là bài toán khác",
        body: "Quan sát đầy đủ hay một phần, tất định hay ngẫu nhiên, tĩnh hay động: mỗi thuộc tính đổi cách tác tử phải suy nghĩ.",
        line: 2,
        mark: [2],
        watch: [{ name: "quan sát", value: "một phần", type: "môi trường" }, { name: "kết quả", value: "ngẫu nhiên", type: "môi trường" }],
        output: "",
        visual: S.table(["Thuộc tính", "Ví dụ", "Ảnh hưởng"], [
          ["Quan sát đầy đủ", "cờ vua", "biết toàn bộ bàn cờ"],
          ["Quan sát một phần", "lái xe", "phải nhớ và dự đoán"],
          ["Tất định", "8-puzzle", "cùng hành động, cùng kết quả"],
          ["Ngẫu nhiên", "bán vé máy bay", "phải tính xác suất"],
          ["Tĩnh / động", "Sudoku / giao thông", "môi trường có đổi trong lúc suy nghĩ?"]
        ], 1, "Mỗi dòng là một cặp lựa chọn thiết kế")
      },
      {
        short: "Hợp lý",
        type: "SO SÁNH",
        title: "Hợp lý không đồng nghĩa luôn đúng",
        body: "Tác tử hợp lý chọn hành động cho kết quả kỳ vọng tốt nhất với thông tin đang có. Nếu thông tin sai hoặc môi trường đổi, nó vẫn có thể thất bại.",
        line: 4,
        mark: [4],
        watch: [{ name: "kiểu", value: "dựa lợi ích", type: "agent" }, { name: "tiêu chí", value: "kỳ vọng", type: "đánh giá" }],
        output: "",
        visual: S.table(["Kiểu tác tử", "Dựa vào", "Ví dụ"], [
          ["Phản xạ", "luật if–then", "đèn tự động"],
          ["Mô hình", "trạng thái ẩn", "robot hút bụi"],
          ["Mục tiêu", "kế hoạch tới đích", "GPS tìm đường"],
          ["Lợi ích", "điểm số kỳ vọng", "trợ lý đặt vé"]
        ], 3, "Càng xuống, tác tử càng cần suy luận")
      },
      {
        short: "Kết luận",
        type: "KẾT THÚC",
        title: "Tách môi trường khỏi thuật toán",
        body: "Khi mô tả đúng môi trường, phần còn lại là chọn thuật toán. Đó cũng là cách đọc mọi hệ AI: đầu vào nào, trạng thái nào, hành động nào, phần thưởng nào.",
        line: 1,
        mark: [1, 7],
        watch: [{ name: "tác tử", value: "policy + state", type: "thành phần" }, { name: "vòng lặp", value: "mãi tới khi dừng", type: "điều khiển" }],
        output: "",
        tone: "final",
        visual: S.flow([{ label: "Môi trường", sub: "đề bài" }, { label: "Cảm nhận", sub: "dữ liệu" }, { label: "Suy luận", sub: "state + policy" }, { label: "Hành động", sub: "thay đổi thế giới" }], [3], [0, 1, 2]),
        changes: ["Chốt mô hình trước khi chọn thuật toán."]
      }
    ]
  };

  L["bfs-dfs"] = {
    id: "bfs-dfs",
    track: "ai",
    module: "ai-search",
    title: "Tìm kiếm mù: BFS và DFS",
    shortTitle: "BFS & DFS",
    subtitle: "Hai cách duyệt không gian trạng thái: theo tầng hoặc đi sâu tới cùng.",
    blurb: "Khi chưa có manh mối nào về đích, vẫn có thể tìm có hệ thống. Khác biệt nằm ở cấu trúc biên giới: hàng đợi hay ngăn xếp.",
    level: "Cơ bản",
    duration: "15 phút",
    tags: ["BFS", "DFS", "frontier", "visited", "tìm kiếm"],
    learn: [
      "Biên giới (frontier) chứa các nút chờ mở rộng",
      "BFS dùng hàng đợi, mở rộng theo tầng",
      "DFS dùng ngăn xếp, đi sâu rồi quay lui",
      "visited chặn vòng lặp và nút trùng"
    ],
    code: `frontier = Queue([S])
visited = {S}
while frontier:
    u = frontier.pop()
    if u == goal:
        return u
    for v in neighbors(u):
        if v not in visited:
            visited.add(v)
            frontier.push(v)
return None`,
    file: "search.py",
    life: {
      icon: "tree",
      title: "Tìm nhà trong khu phố lạ",
      text: "BFS giống hỏi từng dãy nhà gần nhất rồi mới sang dãy xa: chắc chắn tìm ra đường ngắn nhất nếu mỗi bước đều ngang nhau. DFS giống rẽ vào một ngõ và đi tới cùng trước khi quay ra."
    },
    steps: [
      {
        short: "Biên giới",
        type: "BẮT ĐẦU",
        title: "Bắt đầu với một nút trong biên giới",
        body: "Frontier là danh sách những nút đã biết nhưng chưa mở rộng. Ban đầu chỉ có điểm xuất phát S; visited giữ những nút đã đưa vào biên giới để không lặp lại.",
        line: 1,
        mark: [1, 2],
        watch: [{ name: "frontier", value: "[S]", type: "hàng chờ" }, { name: "visited", value: "{S}", type: "tập" }],
        output: "",
        visual: S.graph([
          { id: "S", x: 60, y: 160, state: "active" },
          { id: "A", x: 190, y: 80 }, { id: "B", x: 190, y: 240 },
          { id: "C", x: 330, y: 80 }, { id: "D", x: 330, y: 240 },
          { id: "G", x: 470, y: 160 }
        ], [["S", "A"], ["S", "B"], ["A", "C"], ["B", "D"], ["C", "G"], ["D", "G"]], "Đồ thị 6 nút, đích G")
      },
      {
        short: "Theo tầng",
        type: "LAN TỎA",
        title: "BFS mở rộng lần lượt từng tầng",
        body: "Lấy S ra khỏi biên giới, thêm A và B. Lượt sau lấy A rồi B, thêm C và D. Đích G chỉ được thấy khi tới tầng 3.",
        line: 4,
        mark: [4, 7, 8, 9, 10],
        watch: [{ name: "frontier", value: "[A, B]", type: "hàng đợi" }, { name: "visited", value: "{S, A, B}", type: "tập" }],
        output: "",
        visual: S.graph([
          { id: "S", x: 60, y: 160, state: "done" },
          { id: "A", x: 190, y: 80, state: "open", badge: "2" }, { id: "B", x: 190, y: 240, state: "open", badge: "2" },
          { id: "C", x: 330, y: 80, state: "dim" }, { id: "D", x: 330, y: 240, state: "dim" },
          { id: "G", x: 470, y: 160, state: "dim" }
        ], [{ from: "S", to: "A", state: "done" }, { from: "S", to: "B", state: "done" }, ["A", "C"], ["B", "D"], ["C", "G"], ["D", "G"]], "Số nhỏ là độ sâu từ S")
      },
      {
        short: "Hai cấu trúc",
        type: "SO SÁNH",
        title: "Cùng mã, đổi hàng đợi thành ngăn xếp",
        body: "BFS lấy nút cũ nhất trước nên lan theo chiều rộng. DFS lấy nút mới nhất trước nên lao theo một nhánh. Chỉ một dòng cấu trúc dữ liệu đổi, thứ tự duyệt đổi hoàn toàn.",
        line: 1,
        mark: [1, 4],
        watch: [{ name: "BFS", value: "queue · FIFO", type: "cấu trúc" }, { name: "DFS", value: "stack · LIFO", type: "cấu trúc" }],
        output: "",
        visual: S.table(["Thuật toán", "Thứ tự thăm", "Đường tới G", "Bộ nhớ biên giới"], [
          ["BFS", "S, A, B, C, D, G", "S → A → C → G", "rộng: theo tầng"],
          ["DFS", "S, A, C, G", "S → A → C → G", "sâu: theo nhánh"]
        ], 0, "Thứ tự phụ thuộc cách duyệt lân cận")
      },
      {
        short: "Chi phí",
        type: "PHÂN TÍCH",
        title: "BFS tốn bộ nhớ, DFS có thể đi lạc",
        body: "Với hệ số phân nhánh b và độ sâu d, BFS giữ tới O(b^d) nút trong biên giới. DFS chỉ giữ O(b·d) nhưng có thể lao rất sâu trước khi thấy đích, và không bảo đảm đường ngắn nhất.",
        line: 3,
        mark: [3],
        watch: [{ name: "b", value: "2", type: "nhánh" }, { name: "d", value: "20", type: "độ sâu" }],
        output: "",
        visual: S.big([
          { label: "BFS", text: "bộ nhớ O(b^d) · đường ngắn nhất", value: 80, active: true },
          { label: "DFS", text: "bộ nhớ O(b·d) · có thể lạc nhánh", value: 25 },
          { label: "IDS", text: "lặp sâu dần · cân bằng hai cực", value: 55 }
        ], "Cùng một đồ thị, đánh đổi khác nhau")
      },
      {
        short: "Kết luận",
        type: "KẾT THÚC",
        title: "Không manh mối thì vẫn phải có kỷ luật",
        body: "BFS và DFS không thông minh hơn mà có tổ chức hơn. Chúng là nền để thêm chi phí (UCS) hay ước lượng (A*), và là cách kiểm tra một không gian trạng thái có được duyệt hết hay không.",
        line: 5,
        mark: [5, 6],
        watch: [{ name: "đường", value: "S → A → C → G", type: "lời giải" }, { name: "chi phí", value: "3 cạnh", type: "độ dài" }],
        output: "S A C G",
        tone: "final",
        visual: S.graph([
          { id: "S", x: 60, y: 160, state: "done" },
          { id: "A", x: 190, y: 80, state: "done" }, { id: "B", x: 190, y: 240, state: "dim" },
          { id: "C", x: 330, y: 80, state: "done" }, { id: "D", x: 330, y: 240, state: "dim" },
          { id: "G", x: 470, y: 160, state: "active" }
        ], [{ from: "S", to: "A", state: "done" }, { from: "A", to: "C", state: "done" }, { from: "C", to: "G", state: "active" }, ["S", "B"], ["B", "D"], ["D", "G"]], "Đường BFS tìm được trên đồ thị này")
      }
    ]
  };

  L["ucs-astar"] = {
    id: "ucs-astar",
    track: "ai",
    module: "ai-search",
    title: "Tìm kiếm có chi phí: UCS và A*",
    shortTitle: "UCS & A*",
    subtitle: "Khi mỗi bước có giá khác nhau, thứ tự mở rộng phải đổi theo chi phí.",
    blurb: "BFS giả định mọi cạnh ngang nhau. Thực tế đường ngắn nhất về số bước có thể đắt nhất về xăng. UCS và A* sửa đúng chỗ đó.",
    level: "Trung cấp",
    duration: "16 phút",
    tags: ["UCS", "A*", "heuristic", "chi phí", "tối ưu"],
    learn: [
      "UCS luôn mở rộng nút có chi phí g nhỏ nhất",
      "A* cộng thêm ước lượng h để hướng tới đích",
      "h phải không vượt chi phí thật để A* còn tối ưu",
      "Heuristic tốt cắt số nút phải mở rộng"
    ],
    code: `frontier = PriorityQueue([(0, S)])
best = {S: 0}
while frontier:
    f, u = frontier.pop()
    if u == goal:
        return u
    for v, w in edges(u):
        g = best[u] + w
        if g < best.get(v, inf):
            best[v] = g
            frontier.push((g + h(v), v))`,
    file: "astar.py",
    life: {
      icon: "bulb",
      title: "Chọn tuyến về quê",
      text: "Đường ven ngắn hơn về số km nhưng nhiều đèn đỏ; cao tốc vòng xa hơn nhưng nhanh hơn. UCS tính theo giờ thực tế, còn A* còn nhìn thêm biển chỉ dẫn để đoán tuyến nào đang có lợi."
    },
    steps: [
      {
        short: "Chi phí cạnh",
        type: "BẮT ĐẦU",
        title: "Mỗi cạnh có một giá riêng",
        body: "Sang B rẻ hơn sang A, dù cả hai đều cách S một cạnh. Từ đây, so sánh đường đi phải cộng trọng số chứ không đếm số cạnh.",
        line: 8,
        mark: [8, 9],
        watch: [{ name: "g(S)", value: "0", type: "chi phí" }, { name: "g(A)", value: "1", type: "chi phí" }, { name: "g(B)", value: "2", type: "chi phí" }],
        output: "",
        visual: S.graph([
          { id: "S", x: 60, y: 160, state: "active", badge: "0" },
          { id: "A", x: 190, y: 80, state: "open", badge: "1" }, { id: "B", x: 190, y: 240, state: "open", badge: "2" },
          { id: "C", x: 330, y: 80 }, { id: "D", x: 330, y: 240 },
          { id: "G", x: 470, y: 160 }
        ], [
          { from: "S", to: "A", weight: 1, state: "active" },
          { from: "S", to: "B", weight: 2, state: "active" },
          { from: "A", to: "C", weight: 2 }, { from: "B", to: "D", weight: 2 },
          { from: "A", to: "D", weight: 5 }, { from: "C", to: "G", weight: 6 },
          { from: "D", to: "G", weight: 3 }
        ], "Số trên cạnh là chi phí; số cạnh nút là g tạm thời")
      },
      {
        short: "UCS",
        type: "MỞ RỘNG",
        title: "Luôn lấy nút rẻ nhất ra trước",
        body: "Hàng đợi ưu tiên sắp theo g. UCS mở S, rồi A (g=1), rồi B (g=2), rồi C (g=3), rồi D (g=4) và cuối cùng G (g=7). Không nút nào bị bỏ qua oan.",
        line: 4,
        mark: [4, 5],
        watch: [{ name: "frontier", value: "(1,A) (2,B) (3,C)", type: "ưu tiên" }, { name: "G tốt nhất", value: "7", type: "chi phí" }],
        output: "",
        visual: S.graph([
          { id: "S", x: 60, y: 160, state: "done", badge: "0" },
          { id: "A", x: 190, y: 80, state: "done", badge: "1" }, { id: "B", x: 190, y: 240, state: "done", badge: "2" },
          { id: "C", x: 330, y: 80, state: "open", badge: "3" }, { id: "D", x: 330, y: 240, state: "open", badge: "4" },
          { id: "G", x: 470, y: 160, state: "dim", badge: "7" }
        ], [{ from: "S", to: "A", weight: 1, state: "done" }, { from: "S", to: "B", weight: 2, state: "done" }, { from: "A", to: "C", weight: 2, state: "done" }, { from: "B", to: "D", weight: 2, state: "done" }, { from: "A", to: "D", weight: 5 }, { from: "C", to: "G", weight: 6 }, { from: "D", to: "G", weight: 3, state: "active" }], "UCS đã chốt g cho các nút gần nhất")
      },
      {
        short: "Heuristic",
        type: "SO SÁNH",
        title: "A* cộng thêm linh cảm có cơ sở",
        body: "h là ước lượng chi phí còn lại tới G. A* ưu tiên theo f = g + h. Với h ở đây, B có f = 7 và được mở trước A (f = 8), nên đích lộ ra sớm hơn.",
        line: 11,
        mark: [11],
        watch: [{ name: "h(S)", value: "8", type: "heuristic" }, { name: "f(B)", value: "2 + 5 = 7", type: "ưu tiên" }, { name: "f(A)", value: "1 + 7 = 8", type: "ưu tiên" }],
        output: "",
        visual: S.graph([
          { id: "S", x: 60, y: 160, state: "done", badge: "8" },
          { id: "A", x: 190, y: 80, state: "open", badge: "8" }, { id: "B", x: 190, y: 240, state: "active", badge: "7" },
          { id: "C", x: 330, y: 80, state: "dim", badge: "9" }, { id: "D", x: 330, y: 240, state: "open", badge: "7" },
          { id: "G", x: 470, y: 160, state: "dim", badge: "0" }
        ], [{ from: "S", to: "A", weight: 1 }, { from: "S", to: "B", weight: 2, state: "active" }, { from: "A", to: "C", weight: 2 }, { from: "B", to: "D", weight: 2, state: "active" }, { from: "A", to: "D", weight: 5 }, { from: "C", to: "G", weight: 6 }, { from: "D", to: "G", weight: 3 }], "Số trong nút là f = g + h; A* đang ưu tiên B")
      },
      {
        short: "Đánh đổi",
        type: "PHÂN TÍCH",
        title: "Heuristic tốt mua bằng hiểu biết bài toán",
        body: "A* chỉ tối ưu nếu h không ước lượng quá tay. h = 0 biến nó thành UCS; h quá lớn chạy nhanh nhưng có thể bỏ lỡ đường tốt nhất.",
        line: 11,
        mark: [11],
        watch: [{ name: "h = 0", value: "thành UCS", type: "an toàn" }, { name: "h quá lớn", value: "mất tối ưu", type: "rủi ro" }],
        output: "",
        visual: S.table(["Chiến lược", "Nút mở rộng", "Bảo đảm tối ưu", "Khi nào dùng"], [
          ["BFS", "6", "có, nếu cạnh ngang nhau", "chi phí đồng đều"],
          ["UCS", "6", "có", "chi phí khác nhau"],
          ["A* với h tốt", "4", "có, nếu h không vượt thật", "có ước lượng đáng tin"],
          ["A* với h quá lớn", "3", "không", "cần nhanh, chấp nhận gần đúng"]
        ], 2, "Cùng đồ thị, số nút phải mở rộng khác nhau")
      },
      {
        short: "Kết luận",
        type: "KẾT THÚC",
        title: "Đường rẻ nhất là S → B → D → G",
        body: "UCS tìm ra chi phí 7 sau khi mở 6 nút; A* chỉ mở 4 nút nhờ h. Cả hai đều đúng, nhưng A* đổi hiểu biết về bài toán lấy tốc độ.",
        line: 6,
        mark: [6],
        watch: [{ name: "đường", value: "S → B → D → G", type: "lời giải" }, { name: "chi phí", value: "2 + 2 + 3 = 7", type: "tổng" }],
        output: "S B D G",
        tone: "final",
        visual: S.graph([
          { id: "S", x: 60, y: 160, state: "done", badge: "0" },
          { id: "A", x: 190, y: 80, state: "dim" }, { id: "B", x: 190, y: 240, state: "done", badge: "2" },
          { id: "C", x: 330, y: 80, state: "dim" }, { id: "D", x: 330, y: 240, state: "done", badge: "4" },
          { id: "G", x: 470, y: 160, state: "active", badge: "7" }
        ], [{ from: "S", to: "B", weight: 2, state: "done" }, { from: "B", to: "D", weight: 2, state: "done" }, { from: "D", to: "G", weight: 3, state: "active" }, { from: "S", to: "A", weight: 1 }, { from: "A", to: "C", weight: 2 }, { from: "A", to: "D", weight: 5 }, { from: "C", to: "G", weight: 6 }], "Tuyến tối ưu theo chi phí, không theo số cạnh")
      }
    ]
  };

  L.minimax = {
    id: "minimax",
    track: "ai",
    module: "ai-games",
    title: "Minimax: chơi như đối thủ giỏi nhất",
    shortTitle: "Minimax",
    subtitle: "Giả định đối thủ luôn chọn nước bất lợi nhất cho bạn, rồi chọn nước tốt nhất trong thế bị ép.",
    blurb: "Cờ vua, cờ caro, tic-tac-toe đều là trò chơi đối kháng. Minimax biến bàn cờ thành cây nước đi và lan giá trị từ lá lên gốc.",
    level: "Trung cấp",
    duration: "16 phút",
    tags: ["minimax", "trò chơi", "cây", "MAX", "MIN"],
    learn: [
      "MAX chọn giá trị lớn nhất, MIN chọn nhỏ nhất",
      "Giá trị lan từ lá ngược lên gốc",
      "Nước đi tối ưu giả định đối thủ hoàn hảo",
      "Cây tăng theo số nhánh mũ số tầng"
    ],
    code: `def minimax(node, me):
    if node.leaf:
        return score(node)
    if me:
        return max(minimax(c, False) for c in node.kids)
    return min(minimax(c, True) for c in node.kids)`,
    file: "minimax.py",
    life: {
      icon: "tree",
      title: "Đi nước cờ trong đầu",
      text: "Bạn thử một nước, rồi tự hỏi: nếu mình là đối thủ, mình sẽ chặn ở đâu? Minimax chính là việc đó, nhưng làm cho mọi nước thay vì chỉ một vài nước quen thuộc."
    },
    steps: [
      {
        short: "Hai vai",
        type: "BẮT ĐẦU",
        title: "MAX và MIN luân phiên trong cây nước đi",
        body: "Gốc là lượt của bạn (MAX). Mỗi tầng tiếp theo đổi vai. Lá là thế cờ kết thúc, có điểm số cố định.",
        line: 2,
        mark: [2],
        watch: [{ name: "gốc", value: "MAX", type: "lượt" }, { name: "tầng 1", value: "MIN", type: "đối thủ" }],
        output: "",
        visual: S.tree([
          { id: "A", x: 330, y: 50, state: "active", label: "A" },
          { id: "B", x: 180, y: 150, label: "B" }, { id: "C", x: 480, y: 150, label: "C" },
          { id: "D", x: 90, y: 250, label: "3" }, { id: "E", x: 210, y: 250, label: "5" },
          { id: "F", x: 390, y: 250, label: "2" }, { id: "G", x: 510, y: 250, label: "9" }
        ], [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"], ["C", "G"]], "A là MAX, B và C là MIN, các lá là điểm cuối")
      },
      {
        short: "Lá",
        type: "CHẤM ĐIỂM",
        title: "Giá trị bắt đầu từ thế cờ kết thúc",
        body: "Không thể đánh giá nước đi nếu chưa biết kết cục. Các lá D, E, F, G lần lượt được 3, 5, 2, 9 điểm theo góc nhìn của MAX.",
        line: 3,
        mark: [3],
        watch: [{ name: "D", value: "3", type: "lá" }, { name: "E", value: "5", type: "lá" }, { name: "F", value: "2", type: "lá" }, { name: "G", value: "9", type: "lá" }],
        output: "",
        visual: S.tree([
          { id: "A", x: 330, y: 50, label: "A" },
          { id: "B", x: 180, y: 150, state: "open", label: "B" }, { id: "C", x: 480, y: 150, state: "open", label: "C" },
          { id: "D", x: 90, y: 250, state: "done", label: "3" }, { id: "E", x: 210, y: 250, state: "done", label: "5" },
          { id: "F", x: 390, y: 250, state: "done", label: "2" }, { id: "G", x: 510, y: 250, state: "done", label: "9" }
        ], [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"], ["C", "G"]], "Lá đã có điểm, nút trong chưa")
      },
      {
        short: "MIN chặn",
        type: "LAN NGƯỢC",
        title: "Đối thủ chọn lá thấp nhất",
        body: "Tại B, MIN chọn min(3, 5) = 3. Tại C, MIN chọn min(2, 9) = 2. Đây là kết quả nếu đối thủ chơi đúng và luôn làm bạn khó chịu nhất.",
        line: 6,
        mark: [6],
        watch: [{ name: "B", value: "min(3, 5) = 3", type: "MIN" }, { name: "C", value: "min(2, 9) = 2", type: "MIN" }],
        output: "",
        visual: S.tree([
          { id: "A", x: 330, y: 50, label: "A" },
          { id: "B", x: 180, y: 150, state: "active", badge: "3", label: "B" },
          { id: "C", x: 480, y: 150, state: "active", badge: "2", label: "C" },
          { id: "D", x: 90, y: 250, state: "done", label: "3" }, { id: "E", x: 210, y: 250, state: "done", label: "5" },
          { id: "F", x: 390, y: 250, state: "done", label: "2" }, { id: "G", x: 510, y: 250, state: "done", label: "9" }
        ], [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"], ["C", "G"]], "MIN chỉ để lại nút con thấp nhất")
      },
      {
        short: "MAX chọn",
        type: "LAN NGƯỢC",
        title: "Bạn chọn nhánh có giá trị cao hơn",
        body: "Từ A, bạn so 3 và 2 rồi chọn nhánh B. Giá trị gốc là 3 — kết quả chắc chắn đạt được nếu cả hai bên chơi tối ưu.",
        line: 5,
        mark: [5],
        watch: [{ name: "A", value: "max(3, 2) = 3", type: "MAX" }, { name: "nước đi", value: "sang B", type: "quyết định" }],
        output: "",
        visual: S.tree([
          { id: "A", x: 330, y: 50, state: "active", badge: "3", label: "A" },
          { id: "B", x: 180, y: 150, state: "done", badge: "3", label: "B" },
          { id: "C", x: 480, y: 150, state: "dim", badge: "2", label: "C" },
          { id: "D", x: 90, y: 250, state: "done", label: "3" }, { id: "E", x: 210, y: 250, state: "dim", label: "5" },
          { id: "F", x: 390, y: 250, state: "dim", label: "2" }, { id: "G", x: 510, y: 250, state: "dim", label: "9" }
        ], [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"], ["C", "G"]], "Nhánh C bị bỏ vì giá trị thấp hơn")
      },
      {
        short: "Kết luận",
        type: "KẾT THÚC",
        title: "Đúng trong giả định, đắt trong thực tế",
        body: "Minimax cho nước đi tối ưu nếu đối thủ cũng tối ưu. Với cờ vua, cây có khoảng 10^40 nút, nên cần cắt tỉa và giới hạn độ sâu — đó là lý do alpha–beta xuất hiện.",
        line: 1,
        mark: [1],
        watch: [{ name: "nước tối ưu", value: "A → B → D", type: "lời giải" }, { name: "điểm", value: "3", type: "giá trị" }],
        output: "B",
        tone: "final",
        visual: S.big([
          { label: "Tic-tac-toe", text: "≈ 10^5 thế cờ", value: 20 },
          { label: "Cờ vua", text: "≈ 10^40 thế cờ", value: 92, active: true },
          { label: "Giới hạn độ sâu", text: "cắt cây để kịp suy nghĩ", value: 45 }
        ], "Số thế cờ quyết định có thể duyệt hết hay không")
      }
    ]
  };
})();
