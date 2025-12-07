// postController.js

exports.submitPost = async (req, res) => {
    // 1. Lấy dữ liệu bài viết từ req.body
    const { title, content, image, status, scheduleDate, seoTitle, metaDesc } = req.body;

    // 2. Kiểm tra dữ liệu và xác định tác giả (từ token đã được giải mã)
    // const authorId = req.user.id; // Nếu bạn dùng middleware xác thực

    if (!title || !content) {
        return res.status(400).json({ message: "Tiêu đề và nội dung không được để trống." });
    }

    try {
        // 3. Thực hiện logic lưu vào Database (ví dụ: dùng Sequelize, Mongoose)
        // const newPost = await Post.create({ 
        //    title, content, image, status, scheduleDate, authorId
        // });

        console.log(`Bài viết "${title}" đã nhận và được lưu với trạng thái: ${status}`);

        // 4. Gửi phản hồi thành công về Front-end
        return res.status(201).json({ 
            message: 'Bài viết đã được gửi thành công và chờ phê duyệt.',
            status: status 
        });

    } catch (error) {
        console.error("Lỗi khi lưu bài viết vào DB:", error);
        return res.status(500).json({ message: 'Lỗi server nội bộ khi lưu bài viết.' });
    }
};