# 🏋️ Workout Detail Page - Phân tích & Kế hoạch Triển khai

## 1. Thông tin cần hiển thị

- Tiêu đề Workout (name, badge sponsored nếu có)
- Thông tin tác giả (avatar, username, ngày tạo, badge xác thực)
- Mô tả Workout (description, mục tiêu, lợi ích)
- Danh sách Exercises (tên, set, rep, duration, hình ảnh)
- Thông tin tổng quan: thời lượng, độ khó, danh mục, thiết bị, nhóm cơ, calories
- Social features: likeCount, saveCount, shareCount, isLiked, isSaved, nút Like/Save/Share
- Phần đánh giá (Reviews): điểm trung bình, tổng số đánh giá, danh sách review, nút viết review
- Hướng dẫn/ghi chú: hướng dẫn thực hiện, lưu ý an toàn, tips
- Sponsored content: logo sponsor, disclosure, campaign info (nếu có)
- Analytics (nếu là admin): views, completions, engagement
- Nút bắt đầu tập luyện (Start Workout/Add to Queue)
- Breadcrumbs/Navigation

## 2. API cần thiết

- GET /api/workouts/:id (hoặc /:slug): chi tiết workout
- GET /api/exercises?ids=...: chi tiết các exercise con
- GET /api/reviews?targetType=workout&targetId=...: danh sách review
- POST /api/workouts/:id/like: like/unlike workout
- POST /api/workouts/:id/save: save/unsave workout
- POST /api/reviews: gửi review mới
- GET /api/users/:id: thông tin tác giả (nếu không trả về kèm workout)
- GET /api/analytics/workout/:id: analytics (nếu là admin)

## 3. Bố cục & Component

- WorkoutDetailPage: Trang tổng thể, fetch data, Suspense boundary
- WorkoutHeader: Tiêu đề, nút like/save/share, quick stats
- WorkoutAuthorInfo: Thông tin tác giả
- WorkoutOverviewCard: Mô tả, nhóm cơ, thiết bị, tags
- ExerciseList: Danh sách exercise (dùng ExerciseCard)
- WorkoutActionBar: Nút Start, Add to Queue, Share
- WorkoutReviewSection: Điểm trung bình, danh sách review, form gửi review
- SponsoredInfoCard: Thông tin sponsor (nếu có)
- WorkoutAnalytics: Analytics (chỉ admin)
- RelatedWorkouts: Gợi ý workout khác

## 4. Kế hoạch triển khai

1. Tạo file component `WorkoutDetailPage.tsx` và các component con theo phân tích trên
2. Sử dụng dữ liệu mẫu dựa trên interface trong `types/`
3. Ưu tiên dựng UI, chia section rõ ràng, responsive
4. Tích hợp dần các API sau khi hoàn thiện UI
5. Áp dụng React 19 patterns (Actions, useOptimistic, Suspense) khi phù hợp

---

**Ghi chú:**
- Dữ liệu mẫu lấy từ interface: `Workout`, `WorkoutExercise`, `User`, `Review`, ...
- Ưu tiên Material UI, design system, responsive layout
- Tách nhỏ component, dễ maintain/test
