/* AILab — cheatsheets */
(function () {
  "use strict";
  window.AILAB.cheatsheets = [
    {
      id: "ai-search",
      track: "ai",
      title: "Chọn thuật toán tìm kiếm",
      subtitle: "Bốn lựa chọn và điều kiện đi kèm",
      icon: "tree",
      tone: "blue",
      items: [
        { label: "BFS", code: `frontier = Queue([start])
while frontier:
    u = frontier.pop()
    for v in neighbors(u): push(v)`, note: "Đường ít cạnh nhất khi mọi cạnh cùng chi phí; tốn bộ nhớ theo chiều rộng." },
        { label: "DFS", code: `frontier = Stack([start])
while frontier:
    u = frontier.pop()
    for v in neighbors(u): push(v)`, note: "Ít bộ nhớ, có thể đi rất sâu; không bảo đảm đường ngắn nhất." },
        { label: "UCS / A*", code: `pop min(g(u))
# A*: pop min(g(u) + h(u))
# yêu cầu: h không ước lượng quá thật`, note: "UCS tối ưu theo chi phí; A* định hướng bằng heuristic." }
      ]
    },
    {
      id: "ai-games",
      track: "ai",
      title: "Trò chơi & ràng buộc",
      subtitle: "Minimax, alpha–beta và CSP",
      icon: "cube",
      tone: "violet",
      items: [
        { label: "Minimax", code: `max: chọn con lớn nhất
min: chọn con nhỏ nhất
giá trị lan từ lá lên gốc`, note: "Giả định đối thủ chơi tối ưu; cây tăng theo số nhánh mũ độ sâu." },
        { label: "Alpha–beta", code: `if alpha >= beta: cắt nhánh
alpha = max(alpha, điểm MAX)
beta  = min(beta, điểm MIN)`, note: "Giữ nguyên kết quả minimax, bỏ nhánh không thể đổi quyết định." },
        { label: "CSP", code: `biến + miền giá trị + ràng buộc
backtracking: thử, kiểm tra, lùi
MRV: chọn biến ít lựa chọn nhất`, note: "Lời giải là phép gán đầy đủ và nhất quán; kiểm tra sớm giảm nhánh." }
      ]
    },
    {
      id: "ai-prob",
      track: "ai",
      title: "Xác suất & quyết định",
      subtitle: "Bayes và MDP trong một trang",
      icon: "book",
      tone: "coral",
      items: [
        { label: "Bayes", code: `P(A|B) = P(B|A) * P(A) / P(B)
posterior ∝ likelihood * prior`, note: "Tỉ lệ nền nhỏ làm bằng chứng yếu đi, dù độ nhạy xét nghiệm cao." },
        { label: "MDP", code: `V(s) = max_a [ R(s,a) + gamma * V(s') ]
gamma gần 1: quan tâm dài hạn`, note: "Value iteration cập nhật V tới khi hội tụ; chính sách là argmax." },
        { label: "Cạm bẫy", code: `prior 1% + test 99% + false 5%
=> posterior chỉ khoảng 17%`, note: "Đừng bỏ qua tỉ lệ nền hoặc nhầm độ chính xác với xác suất mắc bệnh." }
      ]
    },
    {
      id: "ml-core",
      track: "ml",
      title: "Học máy cơ bản",
      subtitle: "k-NN, cây quyết định và đánh giá",
      icon: "code",
      tone: "green",
      items: [
        { label: "k-NN", code: `chuẩn hóa đặc trưng
d = dist(query, x)
bỏ phiếu k mẫu gần nhất`, note: "k nhỏ nhạy nhiễu, k lớn làm mờ ranh giới; k lẻ tránh hòa phiếu." },
        { label: "Cây quyết định", code: `gain = H(trước) - H(sau khi chia)
chọn thuộc tính gain cao nhất`, note: "Cây sâu quá học thuộc dữ liệu; cắt tỉa và kiểm tra chéo để khái quát." },
        { label: "Đánh giá", code: `chia train / validation / test
báo cáo chỉ số theo từng nhóm
kiểm tra chéo 5 fold`, note: "Một chỉ số trung bình có thể che nhóm yếu; luôn xem phân bố lỗi." }
      ]
    },
    {
      id: "ml-modern",
      track: "ml",
      title: "Mô hình hiện đại & đạo đức",
      subtitle: "Nơ-ron, LLM và câu hỏi trách nhiệm",
      icon: "bulb",
      tone: "blue",
      items: [
        { label: "Mạng nơ-ron", code: `z = Wx + b
a = activation(z)
loss = (y - target)^2
W -= lr * grad`, note: "Không có hàm phi tuyến, nhiều tầng vẫn tương đương một tầng tuyến tính." },
        { label: "LLM", code: `token -> vector -> attention
-> xác suất token tiếp theo
-> lặp tới khi dừng`, note: "Tối ưu từ tiếp theo, không tra sự thật; cần RAG và kiểm chứng nguồn." },
        { label: "Kiểm toán AI", code: `kiểm tra dữ liệu và proxy
đo chỉ số theo nhóm
giữ con người trong vòng lặp
mở kênh khiếu nại`, note: "Công bằng là quy trình liên tục, không phải một con số đạt một lần." }
      ]
    }
  ];
})();
