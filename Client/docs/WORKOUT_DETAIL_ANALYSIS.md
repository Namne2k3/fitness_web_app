# 🏋️ Workout Detail Page - Phân Tích & Thiết Kế

## 1. Thông tin cần hiển thị

- **Tiêu đề Workout**: Tên, icon, badge sponsored (nếu có)
- **Tác giả**: Avatar, username, ngày tạo, badge xác thực
- **Mô tả Workout**: Mục tiêu, lợi ích, mô tả chi tiết
- **Danh sách Exercises**: Tên, set, rep, thời lượng, hình ảnh minh họa
- **Tổng quan**:
  - Thời lượng ước tính
  - Độ khó
  - Danh mục
  - Thiết bị
  - Nhóm cơ
  - Calories ước tính
- **Social features**:
  - Số lượt thích, đã thích chưa
  - Số lượt lưu, đã lưu chưa
  - Số lượt chia sẻ
  - Nút Like, Save, Share (optimistic update)
- **Đánh giá (Reviews)**:
  - Điểm trung bình, tổng số đánh giá
  - Danh sách review (user, rating, comment, ảnh)
  - Nút viết review
- **Hướng dẫn/Ghi chú**: Hướng dẫn thực hiện, lưu ý an toàn
- **Sponsored content**: Logo sponsor, disclosure, campaign info (nếu có)
- **Analytics**: Views, completions, engagement (nếu là admin)
- **Nút bắt đầu tập luyện**: Start Workout/ Add to Queue
- **Breadcrumbs/Navigation**

## 2. API cần thiết

- `GET /api/workouts/:id` - Lấy chi tiết workout
- `GET /api/exercises?ids=...` - Lấy chi tiết các exercise con
- `GET /api/reviews?targetType=workout&targetId=...` - Lấy review cho workout
- `POST /api/workouts/:id/like` - Like/unlike workout
- `POST /api/workouts/:id/save` - Save/unsave workout
- `POST /api/reviews` - Gửi review mới
- `GET /api/users/:id` - Lấy thông tin tác giả (nếu cần)
- `GET /api/analytics/workout/:id` - Analytics (nếu là admin)

## 3. Bố cục & Component

- `WorkoutDetailPage`: Trang tổng thể, fetch data, Suspense boundary
- `WorkoutHeader`: Tiêu đề, nút like/save/share, quick stats
- `WorkoutAuthorInfo`: Thông tin tác giả
- `WorkoutOverviewCard`: Mô tả, nhóm cơ, thiết bị, tags
- `ExerciseList`: Danh sách exercise (dùng `ExerciseCard`)
- `WorkoutActionBar`: Nút Start, Add to Queue, Share
- `WorkoutReviewSection`: Điểm trung bình, danh sách review, form gửi review
- `SponsoredInfoCard`: Thông tin sponsor (nếu có)
- `WorkoutAnalytics`: Analytics (chỉ admin)
- `RelatedWorkouts`: Gợi ý workout khác

### Lưu ý React 19
- Dùng `use()` + `Suspense` cho data fetching
- Social features dùng `useOptimistic`
- Tách nhỏ component, responsive, tuân thủ design system
- Review là phần trọng tâm (theo REACT-19-SUMMARY.md)

---

**Kế hoạch tiếp theo:**
1. Tạo route Workout Detail trong AppRouter
2. Tạo file component `WorkoutDetailPage.tsx`
3. Triển khai từng section theo phân tích trên
4. Ưu tiên phần Review (Review Section) theo React 19 best practice
