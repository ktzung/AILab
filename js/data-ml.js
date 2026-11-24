/* AILab — Học máy nhập môn · bài 10–14 */
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

  L.knn = {
    id: "knn",
    track: "ml",
    module: "ml-supervised",
    title: "Hàng xóm gần nhất (k-NN)",
    shortTitle: "k-NN",
    subtitle: "Không học tham số, chỉ ghi nhớ ví dụ và bỏ phiếu theo khoảng cách.",
    blurb: "Một mô hình học máy không nhất thiết phải có trọng số. k-NN giữ toàn bộ dữ liệu huấn luyện và trả lời bằng cách nhìn những mẫu giống nhất.",
    level: "Cơ bản",
    duration: "15 phút",
    tags: ["k-NN", "phân loại", "khoảng cách", "chuẩn hóa", "học có giám sát"],
    learn: [
      "Dự đoán dựa trên k mẫu gần nhất",
      "Khoảng cách phải tính trên đặc trưng đã chuẩn hóa",
      "k nhỏ nhạy nhiễu, k lớn làm mờ ranh giới",
      "Số lẻ giúp tránh hòa phiếu khi phân loại hai lớp"
    ],
    code: `def knn(query, data, k):
    dists = [(dist(query, x), label) for x, label in data]
    dists.sort()
    nearest = dists[:k]
    votes = count(labels in nearest)
    return most_common(votes)`,
    file: "knn.py",
    life: {
      icon: "bulb",
      title: "Hỏi ba người hàng xóm",
      text: "Bạn chuyển tới khu mới và muốn biết quán ăn gần đây có ngon không. Bạn hỏi vài người ở gần nhất. Nếu ba trong năm người nói ngon, bạn tin là ngon. k-NN làm đúng như vậy với dữ liệu."
    },
    steps: [
      {
        short: "Dữ liệu",
        type: "BẮT ĐẦU",
        title: "Mỗi điểm là một ví dụ đã có nhãn",
        body: "Sáu mẫu được biểu diễn bằng hai đặc trưng và một nhãn A hoặc B. Điểm hỏi Q chưa có nhãn; nhiệm vụ là tìm nhãn cho Q từ các hàng xóm.",
        line: 1,
        mark: [1, 2],
        watch: [{ name: "mẫu", value: "6", type: "huấn luyện" }, { name: "đặc trưng", value: "2", type: "chiều" }, { name: "k", value: "3", type: "láng giềng" }],
        output: "",
        visual: S.graph([
          { id: "P1", x: 100, y: 80, label: "1", badge: "A" },
          { id: "P2", x: 180, y: 60, label: "2", badge: "A" },
          { id: "P3", x: 120, y: 200, label: "3", badge: "A" },
          { id: "P4", x: 380, y: 90, label: "4", badge: "B" },
          { id: "P5", x: 420, y: 210, label: "5", badge: "B" },
          { id: "P6", x: 320, y: 250, label: "6", badge: "B" },
          { id: "Q", x: 250, y: 150, state: "active", label: "Q" }
        ], [], "A là nhóm 1–3, B là nhóm 4–6, Q cần được phân loại")
      },
      {
        short: "Khoảng cách",
        type: "TÍNH",
        title: "Đo khoảng cách từ Q tới từng mẫu",
        body: "Khoảng cách Euclid cộng bình phương chênh lệch hai đặc trưng rồi lấy căn. Q gần mẫu 2 và 6 nhất, mẫu 3 đứng thứ ba.",
        line: 2,
        mark: [2],
        watch: [{ name: "d(Q,2)", value: "116", type: "gần nhất" }, { name: "d(Q,6)", value: "122", type: "thứ hai" }, { name: "d(Q,3)", value: "139", type: "thứ ba" }],
        output: "",
        visual: S.table(["Mẫu", "Nhãn", "Khoảng cách tới Q"], [
          ["2", "A", "116"],
          ["6", "B", "122"],
          ["3", "A", "139"],
          ["4", "B", "144"],
          ["1", "A", "165"],
          ["5", "B", "181"]
        ], 0, "Sắp xếp tăng dần để lấy k mẫu đầu")
      },
      {
        short: "Bỏ phiếu",
        type: "DỰ ĐOÁN",
        title: "Ba hàng xóm gần nhất bỏ phiếu",
        body: "Hai phiếu A (mẫu 2 và 3), một phiếu B (mẫu 6). Đa số thuộc A, nên Q được dự đoán là A. Không có tham số nào được học, chỉ có dữ liệu được giữ.",
        line: 3,
        mark: [3, 4, 5],
        watch: [{ name: "nearest", value: "2, 6, 3", type: "k = 3" }, { name: "phiếu", value: "A:2, B:1", type: "bỏ phiếu" }],
        output: "A",
        visual: S.graph([
          { id: "P1", x: 100, y: 80, label: "1", badge: "A", state: "dim" },
          { id: "P2", x: 180, y: 60, label: "2", badge: "A", state: "done" },
          { id: "P3", x: 120, y: 200, label: "3", badge: "A", state: "done" },
          { id: "P4", x: 380, y: 90, label: "4", badge: "B", state: "dim" },
          { id: "P5", x: 420, y: 210, label: "5", badge: "B", state: "dim" },
          { id: "P6", x: 320, y: 250, label: "6", badge: "B", state: "done" },
          { id: "Q", x: 250, y: 150, state: "active", label: "Q" }
        ], [
          { from: "Q", to: "P2", state: "active" },
          { from: "Q", to: "P6", state: "active" },
          { from: "Q", to: "P3", state: "active" }
        ], "Ba đường nối tới ba hàng xóm gần nhất")
      },
      {
        short: "Chọn k",
        type: "SO SÁNH",
        title: "k quá nhỏ dễ nhiễu, k quá lớn dễ mờ",
        body: "k = 1 chỉ nghe một người, rất nhạy với mẫu sai. k = 5 lấy cả mẫu xa, có thể kéo dự đoán sang nhóm khác. k lẻ thường được chọn để tránh hòa phiếu.",
        line: 1,
        mark: [1],
        watch: [{ name: "k = 1", value: "A", type: "chỉ mẫu 2" }, { name: "k = 5", value: "A:3, B:2", type: "vẫn A" }, { name: "k = 6", value: "hòa 3–3", type: "tránh" }],
        output: "",
        visual: S.table(["k", "Phiếu A", "Phiếu B", "Kết quả", "Nhận xét"], [
          ["1", "1", "0", "A", "nhạy nhiễu"],
          ["3", "2", "1", "A", "cân bằng"],
          ["5", "3", "2", "A", "mượt hơn"],
          ["6", "3", "3", "hòa", "không nên dùng"]
        ], 1, "Số lẻ tránh hòa khi có hai lớp")
      },
      {
        short: "Kết luận",
        type: "KẾT THÚC",
        title: "Chuẩn hóa trước khi đo khoảng cách",
        body: "Nếu một đặc trưng là thu nhập (triệu đồng) và một là tuổi, khoảng cách bị thu nhập chi phối. Phải chuẩn hóa về cùng thang. k-NN cũng chậm khi dữ liệu lớn vì phải so với mọi mẫu.",
        line: 6,
        mark: [6],
        watch: [{ name: "dự đoán Q", value: "A", type: "kết quả" }, { name: "chi phí", value: "O(n·d)", type: "mỗi truy vấn" }],
        output: "A",
        tone: "final",
        visual: S.big([
          { label: "k-NN", text: "so với mọi mẫu", value: 90, active: true },
          { label: "Cây KD", text: "cắt không gian tìm kiếm", value: 45 },
          { label: "Chuẩn hóa", text: "bắt buộc trước khi đo", value: 20 }
        ], "Dễ hiểu nhưng đắt khi dự đoán")
      }
    ]
  };

  L["decision-tree"] = {
    id: "decision-tree",
    track: "ml",
    module: "ml-supervised",
    title: "Cây quyết định",
    shortTitle: "Cây quyết định",
    subtitle: "Học một chuỗi câu hỏi chia dữ liệu thành những nhóm ngày càng thuần.",
    blurb: "Cây quyết định là mô hình học máy dễ đọc nhất: mỗi nút là một câu hỏi, mỗi nhánh là một câu trả lời, mỗi lá là dự đoán. Nó cũng cho thấy ngay nguy cơ học vẹt.",
    level: "Cơ bản",
    duration: "16 phút",
    tags: ["cây quyết định", "entropy", "information gain", "overfit", "phân loại"],
    learn: [
      "Mỗi nút chọn thuộc tính chia dữ liệu tốt nhất",
      "Entropy đo độ lẫn lộn của một nhóm",
      "Information gain là mức giảm entropy",
      "Cây quá sâu học thuộc dữ liệu, cần cắt tỉa"
    ],
    code: `def build(rows, depth):
    if pure(rows) or depth == 0:
        return leaf(majority(rows))
    feat = best_split(rows)
    left, right = split(rows, feat)
    return node(feat, build(left, depth - 1),
                build(right, depth - 1))`,
    file: "tree.py",
    life: {
      icon: "tree",
      title: "Bác sĩ hỏi từng bước",
      text: "Bác sĩ không hỏi mọi câu cùng lúc. Ông hỏi triệu chứng nổi bật nhất, rồi tùy câu trả lời mới hỏi tiếp. Cây quyết định học đúng cách hỏi đó từ dữ liệu cũ."
    },
    steps: [
      {
        short: "Dữ liệu",
        type: "BẮT ĐẦU",
        title: "Bảng ví dụ: có đi chơi hay không",
        body: "Mỗi dòng là một ngày với thời tiết, độ ẩm, gió và quyết định. Cây sẽ học cách hỏi để tách ngày Có khỏi ngày Không bằng ít câu nhất.",
        line: 1,
        mark: [1, 2],
        watch: [{ name: "mẫu", value: "6 ngày", type: "huấn luyện" }, { name: "nhãn", value: "Có / Không", type: "phân loại" }],
        output: "",
        visual: S.table(["Ngày", "Trời", "Độ ẩm", "Gió", "Chơi"], [
          ["1", "Nắng", "Cao", "Yếu", "Không"],
          ["2", "Nắng", "Cao", "Mạnh", "Không"],
          ["3", "Mưa", "Cao", "Yếu", "Có"],
          ["4", "Mưa", "Thấp", "Yếu", "Có"],
          ["5", "Âm u", "Cao", "Yếu", "Có"],
          ["6", "Âm u", "Thấp", "Mạnh", "Có"]
        ], 0, "Dữ liệu nhỏ để nhìn rõ từng bước chia")
      },
      {
        short: "Entropy",
        type: "ĐO",
        title: "Nhóm lẫn lộn có entropy cao",
        body: "Toàn bộ 6 ngày có 2 Không và 4 Có, chưa thuần. Chia theo Trời: Nắng toàn Không (entropy 0), Mưa toàn Có (0), Âm u toàn Có (0). Một thuộc tính hoàn hảo.",
        line: 2,
        mark: [2],
        watch: [{ name: "H(tất cả)", value: "0.918", type: "lẫn lộn" }, { name: "H(theo Trời)", value: "0", type: "thuần" }],
        output: "",
        visual: S.table(["Nhóm", "Không", "Có", "Entropy"], [
          ["Tất cả", "2", "4", "0.918"],
          ["Trời = Nắng", "2", "0", "0"],
          ["Trời = Mưa", "0", "2", "0"],
          ["Trời = Âm u", "0", "2", "0"]
        ], 0, "Entropy 0 là nhóm hoàn toàn thuần")
      },
      {
        short: "Chọn câu hỏi",
        type: "CHIA",
        title: "Information gain chọn thuộc tính tốt nhất",
        body: "Gain = entropy trước trừ entropy sau khi chia. Trời cho gain cao nhất vì tách sạch cả ba nhánh, nên cây chọn Trời làm gốc.",
        line: 4,
        mark: [4],
        watch: [{ name: "gain(Trời)", value: "0.918", type: "cao nhất" }, { name: "gain(Gió)", value: "0.020", type: "thấp" }],
        output: "",
        visual: S.table(["Thuộc tính", "Entropy sau chia", "Information gain"], [
          ["Trời", "0", "0.918"],
          ["Độ ẩm", "0.459", "0.459"],
          ["Gió", "0.918", "0.020"]
        ], 0, "Cây ưu tiên câu hỏi giảm lẫn lộn nhiều nhất")
      },
      {
        short: "Cây",
        type: "DỰNG",
        title: "Gốc Trời, ba nhánh, ba lá",
        body: "Nắng dẫn tới Không; Mưa và Âm u dẫn tới Có. Với dữ liệu này cây chỉ cần một câu hỏi. Với dữ liệu thật, cây tiếp tục hỏi độ ẩm, gió ở các nhánh chưa thuần.",
        line: 5,
        mark: [5, 6],
        watch: [{ name: "gốc", value: "Trời", type: "câu hỏi" }, { name: "độ sâu", value: "1", type: "cây" }],
        output: "",
        visual: S.tree([
          { id: "R", x: 300, y: 50, state: "active", label: "Trời" },
          { id: "S", x: 160, y: 155, label: "Nắng" }, { id: "U", x: 300, y: 155, label: "Âm u" }, { id: "M", x: 440, y: 155, label: "Mưa" },
          { id: "N", x: 160, y: 255, state: "done", label: "Không" },
          { id: "Y1", x: 300, y: 255, state: "done", label: "Có" },
          { id: "Y2", x: 440, y: 255, state: "done", label: "Có" }
        ], [["R", "S"], ["R", "U"], ["R", "M"], ["S", "N"], ["U", "Y1"], ["M", "Y2"]], "Một câu hỏi đã tách sạch dữ liệu mẫu")
      },
      {
        short: "Kết luận",
        type: "KẾT THÚC",
        title: "Cây sâu quá là học thuộc",
        body: "Nếu để cây mọc tới khi mỗi lá chỉ còn một mẫu, nó đạt 100% trên dữ liệu huấn luyện nhưng sai trên dữ liệu mới. Cắt tỉa, giới hạn độ sâu và kiểm tra chéo giữ cây biết khái quát.",
        line: 2,
        mark: [2, 3],
        watch: [{ name: "độ sâu tối đa", value: "3", type: "giới hạn" }, { name: "kiểm tra", value: "chéo 5 fold", type: "đánh giá" }],
        output: "",
        tone: "final",
        visual: S.big([
          { label: "Cây sâu", text: "khớp 100%, kém khái quát", value: 100 },
          { label: "Cây cắt tỉa", text: "khớp 88%, bền hơn", value: 74, active: true },
          { label: "Rừng ngẫu nhiên", text: "nhiều cây bỏ phiếu", value: 60 }
        ], "Độ chính xác trên tập huấn luyện không phải thước đo cuối cùng")
      }
    ]
  };

  L["neural-net"] = {
    id: "neural-net",
    track: "ml",
    module: "ml-modern",
    title: "Mạng nơ-ron: học bằng lan truyền ngược",
    shortTitle: "Mạng nơ-ron",
    subtitle: "Nhiều nơ-ron nhỏ xếp tầng, mỗi kết nối là một trọng số được điều chỉnh từ sai số.",
    blurb: "Mạng nơ-ron không thần kỳ: mỗi nơ-ron cộng có trọng số, qua hàm kích hoạt, rồi lan sai số ngược để sửa trọng số. Xếp nhiều tầng tạo được biểu diễn phức tạp.",
    level: "Trung cấp",
    duration: "18 phút",
    tags: ["nơ-ron", "trọng số", "kích hoạt", "lan truyền ngược", "gradient"],
    learn: [
      "Nơ-ron tính tổng có trọng số rồi qua hàm kích hoạt",
      "Tầng ẩn tạo đặc trưng trung gian",
      "Lan truyền ngược đẩy sai số về từng trọng số",
      "Học là lặp lại dự đoán, đo lỗi, cập nhật"
    ],
    code: `for epoch in range(epochs):
    y = forward(x, weights)
    loss = (y - target) ** 2
    grad = backward(loss, weights)
    weights = weights - lr * grad`,
    file: "nn.py",
    life: {
      icon: "cube",
      title: "Chỉnh tai nghe theo cảm giác",
      text: "Bạn vặn núm âm lượng, nghe thử, thấy vẫn nhỏ nên vặn thêm. Mỗi lần nghe là một lần đo lỗi, mỗi lần vặn là một bước cập nhật. Mạng nơ-ron làm vậy với hàng triệu núm cùng lúc."
    },
    steps: [
      {
        short: "Một nơ-ron",
        type: "BẮT ĐẦU",
        title: "Cộng đầu vào có trọng số",
        body: "Nơ-ron nhận x1, x2, nhân với trọng số w1, w2, cộng bias rồi qua hàm kích hoạt. Trọng số quyết định đầu vào nào quan trọng.",
        line: 2,
        mark: [2],
        watch: [{ name: "z", value: "0.6×1 + 0.4×2 + 0.1", type: "tổng" }, { name: "a", value: "sigmoid(z)", type: "kích hoạt" }],
        output: "",
        visual: S.graph([
          { id: "X1", x: 80, y: 100, state: "active", label: "x1" },
          { id: "X2", x: 80, y: 230, state: "active", label: "x2" },
          { id: "H1", x: 300, y: 165, state: "open", label: "h1" }
        ], [
          { from: "X1", to: "H1", weight: 0.6, state: "active" },
          { from: "X2", to: "H1", weight: 0.4, state: "active" }
        ], "Trọng số trên cạnh là mức ảnh hưởng")
      },
      {
        short: "Kích hoạt",
        type: "PHI TUYẾN",
        title: "Hàm kích hoạt tạo đường cong",
        body: "Nếu chỉ cộng tuyến tính, nhiều tầng vẫn tương đương một tầng. Sigmoid hoặc ReLU bẻ cong đầu ra, cho mạng khả năng học ranh giới phức tạp.",
        line: 2,
        mark: [2],
        watch: [{ name: "ReLU", value: "max(0, z)", type: "hàm" }, { name: "sigmoid", value: "0 đến 1", type: "xác suất" }],
        output: "",
        visual: S.table(["Hàm", "Công thức", "Dùng khi"], [
          ["ReLU", "max(0, z)", "tầng ẩn, mạng sâu"],
          ["Sigmoid", "1 / (1 + e^-z)", "đầu ra nhị phân"],
          ["Softmax", "chuẩn hóa nhiều lớp", "phân loại nhiều lớp"]
        ], 0, "Không có kích hoạt, mạng chỉ là hồi quy tuyến tính")
      },
      {
        short: "Nhiều tầng",
        type: "KIẾN TRÚC",
        title: "Tầng ẩn học đặc trưng trung gian",
        body: "Hai đầu vào nối tới hai nơ-ron ẩn, rồi tới đầu ra. Tầng ẩn không được gán nghĩa trước; nó tự tìm tổ hợp có ích cho việc giảm lỗi.",
        line: 2,
        mark: [2],
        watch: [{ name: "tham số", value: "9 trọng số", type: "2×2 + 2" }, { name: "tầng", value: "2", type: "ẩn + ra" }],
        output: "",
        visual: S.graph([
          { id: "X1", x: 80, y: 100, label: "x1" },
          { id: "X2", x: 80, y: 230, label: "x2" },
          { id: "H1", x: 280, y: 90, state: "open", label: "h1" },
          { id: "H2", x: 280, y: 240, state: "open", label: "h2" },
          { id: "Y", x: 470, y: 165, state: "active", label: "y" }
        ], [
          { from: "X1", to: "H1" }, { from: "X1", to: "H2" },
          { from: "X2", to: "H1" }, { from: "X2", to: "H2" },
          { from: "H1", to: "Y", state: "active" }, { from: "H2", to: "Y", state: "active" }
        ], "Mỗi cạnh là một trọng số cần học")
      },
      {
        short: "Học",
        type: "LAN NGƯỢC",
        title: "Sai số chảy ngược để sửa từng trọng số",
        body: "Dự đoán 0,8 trong khi đáp án 1,0. Đạo hàm của lỗi cho biết trọng số nào đóng góp nhiều vào sai số; cập nhật theo hướng giảm lỗi với tốc độ học lr.",
        line: 4,
        mark: [4, 5],
        watch: [{ name: "dự đoán", value: "0.8", type: "forward" }, { name: "lỗi", value: "0.04", type: "loss" }, { name: "lr", value: "0.01", type: "bước" }],
        output: "",
        visual: S.flow([{ label: "Lan tới", sub: "forward" }, { label: "Tính lỗi", sub: "loss" }, { label: "Lan ngược", sub: "gradient" }, { label: "Sửa trọng số", sub: "update" }], [2], [0, 1])
      },
      {
        short: "Kết luận",
        type: "KẾT THÚC",
        title: "Sức mạnh đến từ nhiều tầng và dữ liệu",
        body: "Một mạng nhỏ học được đường cong; mạng sâu học được ảnh, giọng nói, ngôn ngữ. Nhưng tham số càng nhiều càng cần dữ liệu, tính toán và kiểm soát quá khớp.",
        line: 1,
        mark: [1],
        watch: [{ name: "tham số", value: "9", type: "ví dụ nhỏ" }, { name: "mô hình lớn", value: "hàng tỉ", type: "LLM" }],
        output: "",
        tone: "final",
        visual: S.big([
          { label: "Mạng nhỏ", text: "vài chục tham số", value: 8 },
          { label: "CNN", text: "hàng triệu", value: 45 },
          { label: "LLM", text: "hàng trăm tỉ", value: 100, active: true }
        ], "Cùng nguyên lý, khác quy mô")
      }
    ]
  };

  L["llm-pipeline"] = {
    id: "llm-pipeline",
    track: "ml",
    module: "ml-modern",
    title: "Một mô hình ngôn ngữ trả lời như thế nào",
    shortTitle: "Đường đi của LLM",
    subtitle: "Từ chuỗi ký tự tới token, vector, ngữ cảnh và xác suất từ tiếp theo.",
    blurb: "Mô hình ngôn ngữ không tra cứu câu trả lời. Nó dự đoán từ tiếp theo, lặp lại tới khi hết câu — và đó cũng là nguồn gốc của ảo giác.",
    level: "Trung cấp",
    duration: "17 phút",
    tags: ["LLM", "token", "embedding", "attention", "hallucination"],
    learn: [
      "Văn bản được cắt thành token trước khi vào mô hình",
      "Embedding biến token thành vector",
      "Attention cho mỗi token nhìn các token trước",
      "Mô hình lặp dự đoán từ tiếp theo, không tra cứu sự thật"
    ],
    code: `tokens = tokenize(prompt)
vecs = embed(tokens)
ctx = attention(vecs)
logits = model(ctx)
next = sample(softmax(logits / T))`,
    file: "llm_loop.py",
    life: {
      icon: "bulb",
      title: "Đoán từ tiếp theo",
      text: "Khi đọc “Hôm nay trời đẹp, chúng ta nên đi…”, bạn gần như tự điền “dạo”. Mô hình ngôn ngữ làm điều đó bằng xác suất học từ hàng tỉ câu, rồi lặp lại từng từ một."
    },
    steps: [
      {
        short: "Token",
        type: "BẮT ĐẦU",
        title: "Văn bản bị cắt thành token",
        body: "Mô hình không đọc ký tự. Câu được chia thành các mảnh từ hoặc âm tiết theo bộ từ vựng. Token có thể là cả từ, một phần từ hay dấu câu.",
        line: 1,
        mark: [1],
        watch: [{ name: "câu", value: "Mạng nơ-ron học", type: "đầu vào" }, { name: "token", value: "4 mảnh", type: "bộ từ vựng" }],
        output: "",
        visual: S.flow([{ label: "Mạng", sub: "token 1" }, { label: "nơ", sub: "token 2" }, { label: "-ron", sub: "token 3" }, { label: "học", sub: "token 4" }], [0, 1, 2, 3], []),
        caption: "Cắt theo bộ từ vựng, không theo khoảng trắng"
      },
      {
        short: "Vector",
        type: "BIỂU DIỄN",
        title: "Mỗi token thành một vector",
        body: "Embedding là bảng tra biến token thành dãy số. Các token gần nghĩa có vector gần nhau, nên phép toán trên vector phản ánh quan hệ ngữ nghĩa.",
        line: 2,
        mark: [2],
        watch: [{ name: "chiều", value: "4096", type: "vector" }, { name: "gần nhau", value: "mèo ~ chó", type: "ngữ nghĩa" }],
        output: "",
        visual: S.table(["Token", "3 chiều đầu", "Ghi chú"], [
          ["mèo", "0.21, -0.04, 0.88", "động vật"],
          ["chó", "0.19, -0.02, 0.84", "gần mèo"],
          ["xe", "-0.55, 0.31, 0.12", "xa hai token trên"]
        ], 0, "Vector thật có hàng nghìn chiều")
      },
      {
        short: "Attention",
        type: "NGỮ CẢNH",
        title: "Mỗi token nhìn lại các token trước",
        body: "Attention tính mức liên quan giữa token hiện tại và từng token trước, rồi trộn thông tin theo trọng số. Nhờ vậy nghĩa của từ phụ thuộc ngữ cảnh câu.",
        line: 3,
        mark: [3],
        watch: [{ name: "token", value: "học", type: "hiện tại" }, { name: "chú ý", value: "nơ-ron 0.62", type: "trọng số" }],
        output: "",
        visual: S.table(["Token trước", "Trọng số chú ý", "Vai trò"], [
          ["Mạng", "0.14", "chủ ngữ"],
          ["nơ", "0.18", "bổ nghĩa"],
          ["-ron", "0.62", "ghép với nơ"],
          ["học", "0.06", "động từ hiện tại"]
        ], 2, "Attention không cố định: mỗi ngữ cảnh cho trọng số khác")
      },
      {
        short: "Dự đoán",
        type: "XÁC SUẤT",
        title: "Mô hình chọn từ tiếp theo",
        body: "Đầu ra là xác suất cho mọi token. Nhiệt độ T thấp làm phân phối nhọn, câu ổn định; T cao làm đa dạng nhưng dễ lạc. Sau khi chọn một token, nó được nối vào câu và lặp lại.",
        line: 4,
        mark: [4, 5],
        watch: [{ name: "P(hiệu quả)", value: "0.41", type: "cao nhất" }, { name: "P(tốt)", value: "0.22", type: "thứ hai" }, { name: "T", value: "0.7", type: "nhiệt độ" }],
        output: "hiệu quả",
        visual: S.big([
          { label: "hiệu quả", text: "41%", value: 41, active: true },
          { label: "tốt", text: "22%", value: 22 },
          { label: "nhanh", text: "13%", value: 13 },
          { label: "khác", text: "24%", value: 24 }
        ], "Một bước dự đoán; câu hoàn chỉnh cần nhiều bước")
      },
      {
        short: "Kết luận",
        type: "KẾT THÚC",
        title: "Lưu loát không bảo đảm đúng",
        body: "Mô hình tối ưu cho từ tiếp theo có xác suất cao, không tối ưu cho sự thật. Vì vậy nó có thể bịa nguồn hoặc số liệu rất trôi chảy. RAG, kiểm chứng và trích nguồn là các lớp bổ sung cần thiết.",
        line: 4,
        mark: [4],
        watch: [{ name: "mục tiêu", value: "P(token tiếp)", type: "huấn luyện" }, { name: "rủi ro", value: "ảo giác", type: "giới hạn" }],
        output: "",
        tone: "final",
        visual: S.flow([{ label: "Câu hỏi", sub: "prompt" }, { label: "Mô hình", sub: "dự đoán từ" }, { label: "Câu trả lời", sub: "lưu loát" }, { label: "Kiểm chứng", sub: "nguồn + công cụ" }], [3], [0, 1, 2])
      }
    ]
  };

  L["ai-ethics"] = {
    id: "ai-ethics",
    track: "ml",
    module: "ml-modern",
    title: "Đạo đức AI: thiên lệch và trách nhiệm",
    shortTitle: "Đạo đức AI",
    subtitle: "Mô hình học từ dữ liệu cũ, nên có thể lặp lại cả bất công cũ.",
    blurb: "Một mô hình tuyển dụng chính xác trên tập kiểm tra vẫn có thể đối xử bất công với một nhóm người. Đạo đức AI không phải phần phụ, mà là một phần của thiết kế.",
    level: "Cơ bản",
    duration: "17 phút",
    tags: ["thiên lệch", "công bằng", "quyền riêng tư", "giải thích", "trách nhiệm"],
    learn: [
      "Dữ liệu lịch sử mang theo bất công lịch sử",
      "Thuộc tính thay thế có thể tái tạo phân biệt",
      "Độ chính xác tổng thể che giấu chênh lệch giữa các nhóm",
      "Cần giám sát con người, giải thích và kênh khiếu nại"
    ],
    code: `train(model, data)
evaluate(model, all)          # 92% chính xác
evaluate(model, group_a)      # 88%
evaluate(model, group_b)      # 61%
audit(model, proxies, appeals)`,
    file: "audit.py",
    life: {
      icon: "bulb",
      title: "Chiếc cân cũ",
      text: "Nếu chiếc cân ở chợ đã lệch từ lâu, cân lại đúng cách vẫn ra số sai. Mô hình học từ dữ liệu do con người tạo cũng vậy: nó học cả thói quen lệch có trong dữ liệu."
    },
    steps: [
      {
        short: "Bài toán",
        type: "BẮT ĐẦU",
        title: "Mô hình tuyển dụng học từ quyết định cũ",
        body: "Công ty dùng 10 năm hồ sơ tuyển dụng để huấn luyện mô hình lọc ứng viên. Nếu 10 năm đó thiên về một nhóm, mô hình học luôn cả thiên hướng đó.",
        line: 1,
        mark: [1],
        watch: [{ name: "dữ liệu", value: "10 năm hồ sơ", type: "lịch sử" }, { name: "mục tiêu", value: "dự đoán nhận việc", type: "nhãn" }],
        output: "",
        visual: S.flow([{ label: "Hồ sơ cũ", sub: "dữ liệu" }, { label: "Mô hình", sub: "học mẫu" }, { label: "Sàng lọc", sub: "quyết định" }, { label: "Ứng viên", sub: "chịu tác động" }], [2], [0, 1])
      },
      {
        short: "Thiên lệch",
        type: "KIỂM TRA",
        title: "Tỉ lệ được nhận trong quá khứ đã chênh",
        body: "Nhóm A chiếm 70% hồ sơ và 85% người được nhận; nhóm B chiếm 30% hồ sơ nhưng chỉ 15% người được nhận. Mô hình coi đây là quy luật cần học.",
        line: 2,
        mark: [2],
        watch: [{ name: "nhóm A", value: "85% được nhận", type: "lịch sử" }, { name: "nhóm B", value: "15% được nhận", type: "lịch sử" }],
        output: "",
        visual: S.table(["Nhóm", "Tỉ lệ hồ sơ", "Tỉ lệ được nhận", "Chênh lệch"], [
          ["A", "70%", "85%", "cao"],
          ["B", "30%", "15%", "thấp"]
        ], 1, "Mô hình học từ nhãn lịch sử, không học công bằng")
      },
      {
        short: "Proxy",
        type: "PHÂN TÍCH",
        title: "Thuộc tính thay thế vẫn tiết lộ nhóm",
        body: "Xóa tên nhóm khỏi dữ liệu chưa đủ. Trường học, khu vực, câu lạc bộ có thể tương quan mạnh với nhóm, nên mô hình vẫn tái tạo phân biệt qua đường vòng.",
        line: 3,
        mark: [3],
        watch: [{ name: "đã xóa", value: "giới tính, dân tộc", type: "trực tiếp" }, { name: "còn lại", value: "trường, khu vực", type: "proxy" }],
        output: "",
        visual: S.graph([
          { id: "G", x: 120, y: 80, state: "dim", label: "Nhóm" },
          { id: "S", x: 320, y: 80, state: "open", label: "Trường" },
          { id: "K", x: 520, y: 80, state: "open", label: "Khu vực" },
          { id: "M", x: 320, y: 250, state: "active", label: "Mô hình" }
        ], [
          { from: "G", to: "S", state: "active" },
          { from: "G", to: "K", state: "active" },
          { from: "S", to: "M", state: "active" },
          { from: "K", to: "M", state: "active" }
        ], "Xóa nút Nhóm không cắt được đường ảnh hưởng")
      },
      {
        short: "Đánh giá",
        type: "SO SÁNH",
        title: "Chính xác tổng thể che giấu chênh lệch",
        body: "Mô hình đạt 92% trên toàn bộ, nhưng nhóm A đạt 96% còn nhóm B chỉ 61%. Chỉ số trung bình đẹp không có nghĩa mô hình an toàn cho mọi người.",
        line: 2,
        mark: [2, 3, 4],
        watch: [{ name: "tổng thể", value: "92%", type: "che giấu" }, { name: "nhóm B", value: "61%", type: "thấp" }],
        output: "",
        visual: S.big([
          { label: "Tổng thể", text: "92% chính xác", value: 92 },
          { label: "Nhóm A", text: "96% chính xác", value: 96 },
          { label: "Nhóm B", text: "61% chính xác", value: 61, active: true }
        ], "Cần báo cáo chỉ số theo từng nhóm, không chỉ trung bình")
      },
      {
        short: "Kết luận",
        type: "KẾT THÚC",
        title: "Công bằng là quy trình, không phải một con số",
        body: "Cần kiểm toán dữ liệu và proxy, đánh giá theo nhóm, giải thích quyết định, giữ con người trong vòng lặp và mở kênh khiếu nại. Không mô hình nào tự bảo đảm công bằng mãi mãi.",
        line: 5,
        mark: [5],
        watch: [{ name: "kiểm toán", value: "định kỳ", type: "quy trình" }, { name: "khiếu nại", value: "có kênh", type: "trách nhiệm" }],
        output: "",
        tone: "final",
        visual: S.flow([{ label: "Dữ liệu", sub: "kiểm tra thiên lệch" }, { label: "Mô hình", sub: "đo theo nhóm" }, { label: "Con người", sub: "duyệt ca khó" }, { label: "Khiếu nại", sub: "sửa và học lại" }], [3], [0, 1, 2])
      }
    ]
  };
})();
