/* AILab — khung khóa học và dữ liệu dùng chung */
window.AILAB = {
  version: "20261124",
  tracks: [
    {
      id: "ai",
      name: "Nền tảng Trí tuệ nhân tạo",
      short: "AI nền tảng",
      kicker: "LỘ TRÌNH 01",
      blurb: "Tác tử, tìm kiếm, trò chơi đối kháng, thỏa ràng buộc và ra quyết định dưới bất định — những viên gạch của mọi hệ AI.",
      outcome: "Hiểu tác tử vận hành thế nào, chọn đúng thuật toán tìm kiếm và giải thích được vì sao một nước đi hay một phương án là hợp lý.",
      tone: "teal",
      modules: ["ai-search", "ai-games", "ai-reason"]
    },
    {
      id: "ml",
      name: "Học máy nhập môn",
      short: "Học máy",
      kicker: "LỘ TRÌNH 02",
      blurb: "Từ hàng xóm gần nhất, cây quyết định đến mạng nơ-ron và đường đi của một mô hình ngôn ngữ — học từ dữ liệu thay vì viết luật.",
      outcome: "Đọc được một bài toán học máy: dữ liệu, đặc trưng, mô hình, đánh giá — và nhận ra giới hạn, thiên lệch của mô hình.",
      tone: "amber",
      modules: ["ml-supervised", "ml-modern"]
    }
  ],
  modules: [
    {
      id: "ai-search",
      track: "ai",
      num: "01",
      title: "Tác tử & tìm kiếm",
      blurb: "Cảm nhận, hành động, rồi tìm đường trong không gian trạng thái bằng BFS, DFS và A*.",
      lessons: ["agents", "bfs-dfs", "ucs-astar"]
    },
    {
      id: "ai-games",
      track: "ai",
      num: "02",
      title: "Trò chơi & ràng buộc",
      blurb: "Minimax, cắt tỉa alpha–beta, bài toán thỏa ràng buộc và leo đồi khi không gian quá lớn.",
      lessons: ["minimax", "alpha-beta", "csp", "local-search"]
    },
    {
      id: "ai-reason",
      track: "ai",
      num: "03",
      title: "Xác suất & quyết định",
      blurb: "Cập nhật niềm tin bằng Bayes và chọn hành động tối ưu qua quá trình quyết định Markov.",
      lessons: ["bayes", "mdp"]
    },
    {
      id: "ml-supervised",
      track: "ml",
      num: "01",
      title: "Học có giám sát",
      blurb: "Học từ ví dụ có nhãn: hàng xóm gần nhất và cây quyết định — hai mô hình dễ đọc nhất.",
      lessons: ["knn", "decision-tree"]
    },
    {
      id: "ml-modern",
      track: "ml",
      num: "02",
      title: "Mô hình hiện đại",
      blurb: "Mạng nơ-ron, đường đi của một mô hình ngôn ngữ và những câu hỏi đạo đức không thể bỏ qua.",
      lessons: ["neural-net", "llm-pipeline", "ai-ethics"]
    }
  ],
  lessons: {},
  practice: [],
  cheatsheets: [],
  meta: {
    autoplayMs: 7200,
    totalLessons: 14
  }
};
