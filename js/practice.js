/* AILab — luyện tập: 14 tình huống, một tình huống cho mỗi bài */
(function () {
  "use strict";
  const L = window.AILAB.lessons;
  let optionShift = 0;

  function item(id, lesson, title, context, question, skill, options, answer, explain, scene) {
    const lessonData = L[lesson];
    const visual = scene || (lessonData && lessonData.steps && lessonData.steps[0]
      ? lessonData.steps[0].visual
      : { kind: "flow", steps: [{ label: "Đọc tình huống" }, { label: "Chọn đáp án" }], active: [0] });
    const shift = optionShift % options.length;
    optionShift += 1;
    const rotatedOptions = options.map((_, index) => options[(index + shift) % options.length]);
    const rotatedAnswer = (answer - shift + options.length) % options.length;
    return { id, track: lessonData ? lessonData.track : "ai", lesson, title, context, question, skill, options: rotatedOptions, answer: rotatedAnswer, explain, visual };
  }

  function flow(steps, active) { return { kind: "flow", steps, active: active || [] }; }
  function table(headers, rows, activeRow, caption) { return { kind: "table", headers, rows, activeRow, caption }; }

  window.AILAB.practice = [
    item("agent-loop", "agents", "Thiếu mắt xích nào?",
      "Một nhóm mô tả tác tử hút bụi gồm cảm biến bụi, bộ nhớ vị trí và động cơ bánh xe. Họ quên mô tả thành phần quyết định đi đâu tiếp theo.",
      "Thành phần còn thiếu trong vòng lặp tác tử là gì?", "Mô hình tác tử",
      ["Cấu trúc dữ liệu lưu bản đồ", "Chính sách chọn hành động", "Hàm in trạng thái", "Trình biên dịch"], 1,
      "Tác tử cần policy: từ trạng thái hiện tại chọn hành động. Cảm biến lo đầu vào, động cơ lo đầu ra; thiếu policy thì không có quyết định.",
      flow([{ label: "Cảm biến", sub: "bụi, va chạm" }, { label: "Trạng thái", sub: "vị trí" }, { label: "Chính sách", sub: "đi đâu?" }, { label: "Động cơ", sub: "di chuyển" }], [2])),
    item("bfs-shortest", "bfs-dfs", "Vì sao BFS tìm được đường ngắn nhất?",
      "Đồ thị có mọi cạnh cùng chi phí. BFS mở rộng theo từng tầng từ điểm xuất phát.",
      "BFS bảo đảm điều gì khi mọi cạnh cùng chi phí?", "Tìm kiếm mù",
      ["Đường ít cạnh nhất tới đích", "Đường có tổng trọng số nhỏ nhất khi cạnh khác nhau", "Luôn dùng ít bộ nhớ nhất", "Không cần tập visited"], 0,
      "Vì BFS duyệt hết tầng gần trước, nút đích đầu tiên được thấy nằm ở độ sâu nhỏ nhất. Khi cạnh có trọng số khác nhau, phải dùng UCS.",
      { kind: "graph", nodes: [
        { id: "S", x: 70, y: 150, state: "done" }, { id: "A", x: 200, y: 80, state: "open" },
        { id: "B", x: 200, y: 220, state: "open" }, { id: "G", x: 340, y: 150, state: "active" }
      ], edges: [["S", "A"], ["S", "B"], ["A", "G"], ["B", "G"]], caption: "G ở tầng 2, BFS thấy sau A và B" }),
    item("astar-heuristic", "ucs-astar", "Khi heuristic bằng 0",
      "Một sinh viên đặt h(s) = 0 cho mọi trạng thái trong A* để chắc chắn không ước lượng quá tay.",
      "A* với h = 0 tương đương thuật toán nào?", "A*",
      ["BFS", "DFS", "UCS", "Leo đồi"], 2,
      "Khi h = 0, tiêu chí f = g + 0 = g. A* luôn mở nút có chi phí thật nhỏ nhất, đúng như UCS. Nó vẫn tối ưu nhưng mất lợi thế định hướng.",
      table(["Thuật toán", "Tiêu chí chọn", "Kết quả"], [["BFS", "độ sâu", "ít cạnh"], ["UCS", "g", "chi phí nhỏ"], ["A* h = 0", "g + 0", "giống UCS"]], 2, "Heuristic bằng 0 là trường hợp suy biến")),
    item("minimax-root", "minimax", "Tính giá trị gốc",
      "Cây trò chơi: gốc MAX có hai nhánh MIN. Nhánh B có lá 3 và 5; nhánh C có lá 2 và 9.",
      "Giá trị minimax tại gốc là bao nhiêu?", "Minimax",
      ["9", "5", "3", "2"], 2,
      "MIN tại B chọn 3, tại C chọn 2. MAX tại gốc chọn max(3, 2) = 3, tức đi theo nhánh B.",
      { kind: "tree", nodes: [
        { id: "A", x: 260, y: 50, state: "active", label: "A" },
        { id: "B", x: 140, y: 150, label: "B" }, { id: "C", x: 380, y: 150, label: "C" },
        { id: "D", x: 80, y: 250, label: "3" }, { id: "E", x: 190, y: 250, label: "5" },
        { id: "F", x: 330, y: 250, label: "2" }, { id: "G", x: 440, y: 250, label: "9" }
      ], edges: [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"], ["C", "G"]], caption: "MAX ở gốc, MIN ở giữa" }),
    item("alphabeta-stop", "alpha-beta", "Khi nào được cắt?",
      "Trong alpha–beta, MAX đang giữ alpha = 5. Tại một nút MIN, vừa đọc một lá cho beta = 4.",
      "Có nên tiếp tục đọc các lá còn lại của nút MIN này?", "Alpha–beta",
      ["Có, vì chưa đọc hết chưa biết chắc", "Không, vì alpha >= beta", "Có, vì beta nhỏ hơn alpha", "Không, vì beta = 4 là số chẵn"], 1,
      "MIN sẽ không để giá trị vượt quá 4, còn MAX đã có 5 ở nơi khác. Nhánh này không thể cải thiện quyết định của MAX, nên cắt.",
      table(["Mốc", "Giá trị", "Hàm ý"], [["alpha", "5", "MAX đã có ít nhất 5"], ["beta", "4", "MIN không cho quá 4"], ["alpha >= beta", "5 >= 4", "cắt nhánh"]], 2, "Cắt không làm đổi nước đi tối ưu")),
    item("csp-solution", "csp", "Thế nào là lời giải CSP?",
      "Bài toán xếp ba lớp vào ba ca với ràng buộc khác ca đôi một và vài điều kiện riêng.",
      "Một lời giải hợp lệ phải thỏa điều kiện gì?", "CSP",
      ["Gán đủ ba lớp, mọi ràng buộc đúng", "Chỉ cần lớp A có ca", "Chỉ cần không trùng ca", "Gán càng nhiều lớp càng tốt"], 0,
      "Lời giải CSP là phép gán đầy đủ cho mọi biến và nhất quán với mọi ràng buộc. Gán thiếu biến hoặc vi phạm một ràng buộc đều chưa phải lời giải.",
      table(["Lớp", "Ca", "Hợp lệ?"], [["A", "Ca 1", "có"], ["B", "Ca 3", "có"], ["C", "Ca 2", "có"]], 0, "Ba lớp, ba ca khác nhau, đủ điều kiện riêng")),
    item("hill-local", "local-search", "Vì sao leo đồi dừng?",
      "Leo đồi đã thử mọi cặp đổi chỗ trong tuyến hiện tại và không cặp nào làm tổng quãng đường giảm.",
      "Điều gì chắc chắn đúng lúc này?", "Tìm kiếm cục bộ",
      ["Đã tìm được tuyến tối ưu toàn cục", "Đang ở cực trị địa phương", "Không còn tuyến nào hợp lệ", "Cần tăng k trong k-NN"], 1,
      "Không còn láng giềng tốt hơn nghĩa là đang đứng ở cực trị địa phương. Vẫn có thể có tuyến tốt hơn ở xa, cần khởi động lại hoặc nhận bước xấu để thoát.",
      table(["Tình huống", "Kết luận"], [["Mọi láng giềng xấu hơn", "cực trị địa phương"], ["Có láng giềng tốt hơn", "đi tiếp"], ["Đã duyệt mọi tuyến", "tối ưu toàn cục"]], 0, "Leo đồi chỉ nhìn quanh, không nhìn toàn cảnh")),
    item("bayes-base-rate", "bayes", "Vì sao dương tính chưa đủ?",
      "Bệnh có tỉ lệ 1% trong dân số. Xét nghiệm nhạy 99%, dương giả 5%. Một người dương tính.",
      "Xác suất người đó mắc bệnh gần nhất với giá trị nào?", "Định lý Bayes",
      ["99%", "95%", "50%", "khoảng 17%"], 3,
      "Trong 10.000 người có 99 dương thật và 495 dương giả, nên posterior là 99/594 ≈ 16,7%. Tỉ lệ nền nhỏ khiến phần lớn dương tính là giả.",
      table(["Nhóm", "Số người", "Dương tính"], [["Bệnh", "100", "99"], ["Khỏe", "9.900", "495"], ["Tổng dương", "", "594"]], 2, "Dương thật 99 trên tổng 594")),
    item("mdp-gamma", "mdp", "Gamma gần 1 nghĩa là gì?",
      "Một robot có thể chọn nhận thưởng nhỏ ngay hoặc đi đường dài tới phần thưởng lớn.",
      "Hệ số chiết khấu gamma gần 1 khiến robot quan tâm điều gì hơn?", "MDP",
      ["Chỉ phần thưởng trước mắt", "Phần thưởng dài hạn", "Số bước ít nhất", "Không quan tâm phần thưởng"], 1,
      "gamma gần 1 làm phần thưởng tương lai gần như không bị giảm, nên robot ưu tiên tổng giá trị dài hạn. gamma nhỏ mới thiên về phần thưởng trước mắt.",
      table(["gamma", "Xu hướng"], [["0", "chỉ nhìn bước kế"], ["0.9", "quan tâm dài hạn"], ["1", "không chiết khấu, dễ phân kỳ"]], 1, "Gamma là mức kiên nhẫn của tác tử")),
    item("knn-scale", "knn", "Chuẩn hóa đặc trưng",
      "Dữ liệu có tuổi (18–60) và thu nhập (5–200 triệu). k-NN tính khoảng cách Euclid trực tiếp.",
      "Vấn đề chính nếu không chuẩn hóa là gì?", "k-NN",
      ["Thu nhập chi phối khoảng cách", "Tuổi luôn chi phối khoảng cách", "k-NN không chạy được", "Nhãn bị đảo"], 0,
      "Chênh lệch thu nhập hàng trăm triệu lớn hơn nhiều chênh lệch tuổi vài chục, nên khoảng cách gần như chỉ phản ánh thu nhập. Cần đưa các đặc trưng về cùng thang.",
      table(["Đặc trưng", "Khoảng giá trị", "Ảnh hưởng thô"], [["Tuổi", "18–60", "42"], ["Thu nhập", "5–200", "195"]], 1, "Đơn vị lớn lấn át đơn vị nhỏ")),
    item("tree-gain", "decision-tree", "Information gain cao nghĩa là gì?",
      "Khi chọn thuộc tính để chia, cây tính entropy trước và entropy sau khi chia.",
      "Thuộc tính có information gain cao nhất là thuộc tính nào?", "Cây quyết định",
      ["Có nhiều giá trị nhất", "Làm các nhóm con thuần nhất nhất", "Xuất hiện sớm trong bảng", "Có ít giá trị thiếu nhất"], 1,
      "Gain là mức giảm entropy. Chia càng làm các nhóm con ít lẫn lộn, gain càng cao, nên cây chọn câu hỏi đó trước.",
      table(["Thuộc tính", "Entropy sau chia", "Gain"], [["Trời", "0", "0.918"], ["Độ ẩm", "0.459", "0.459"], ["Gió", "0.918", "0.020"]], 0, "Entropy thấp là nhóm thuần")),
    item("nn-activation", "neural-net", "Vai trò của hàm kích hoạt",
      "Một mạng nhiều tầng nhưng mọi nơ-ron đều dùng hàm tuyến tính f(z) = z.",
      "Điều gì xảy ra với khả năng biểu diễn của mạng?", "Mạng nơ-ron",
      ["Mạnh hơn nhờ nhiều tầng", "Tương đương một tầng tuyến tính", "Không tính được đầu ra", "Tự động tránh quá khớp"], 1,
      "Hợp của các hàm tuyến tính vẫn là tuyến tính. Không có phi tuyến, nhiều tầng không tạo thêm sức biểu diễn; ReLU hoặc sigmoid mới mở ra đường cong.",
      flow([{ label: "x", sub: "đầu vào" }, { label: "tuyến tính", sub: "z = wx + b" }, { label: "tuyến tính", sub: "vẫn là đường thẳng" }, { label: "y", sub: "đầu ra" }], [2])),
    item("llm-hallucination", "llm-pipeline", "Vì sao mô hình bịa?",
      "Mô hình ngôn ngữ sinh câu trả lời rất trôi chảy về một sự kiện ít gặp.",
      "Nguyên nhân gốc của ảo giác là gì?", "LLM",
      ["Mô hình bị hỏng ngẫu nhiên", "Mô hình tối ưu xác suất từ tiếp theo, không tra sự thật", "Dữ liệu huấn luyện không có tiếng Việt", "Nhiệt độ luôn bằng 0"], 1,
      "Mục tiêu huấn luyện là dự đoán token tiếp theo hợp ngữ cảnh, không phải xác minh sự thật. Câu bịa vẫn có thể có xác suất cao, nên cần RAG hoặc kiểm chứng nguồn.",
      flow([{ label: "Câu hỏi", sub: "prompt" }, { label: "Dự đoán token", sub: "xác suất" }, { label: "Câu trả lời", sub: "trôi chảy" }, { label: "Kiểm chứng", sub: "nguồn" }], [1])),
    item("ethics-average", "ai-ethics", "Chỉ số trung bình",
      "Mô hình đạt 92% chính xác toàn bộ, nhưng nhóm A đạt 96% và nhóm B chỉ 61%.",
      "Kết luận nào đúng nhất?", "Đạo đức AI",
      ["Mô hình đủ tốt vì trên 90%", "Cần báo cáo và xử lý chênh lệch giữa nhóm", "Chỉ cần tăng dữ liệu nhóm A", "Đổi sang mô hình khác là đủ"], 1,
      "Chỉ số tổng thể che giấu khoảng cách 35 điểm giữa hai nhóm. Cần đánh giá theo nhóm, kiểm tra proxy và có biện pháp giảm chênh lệch trước khi triển khai.",
      table(["Phạm vi", "Chính xác"], [["Toàn bộ", "92%"], ["Nhóm A", "96%"], ["Nhóm B", "61%"]], 2, "Trung bình đẹp có thể che một nhóm yếu"))
  ];
})();
