# Assignment 3 - User Authentication

## Tổng quan
Assignment này thêm chức năng xác thực và phân quyền người dùng vào REST API server.

## Các chức năng đã thêm

### 1. User Model
- `username`: Tên người dùng
- `admin`: Boolean flag để xác định quyền admin (mặc định: false)

### 2. Question Model (đã cập nhật)
- Thêm field `author`: ObjectId reference đến User model
- Chỉ author của question mới có thể update/delete question đó

### 3. Authentication Middleware
- `verifyUser()`: Xác thực người dùng (sử dụng user-id header)
- `verifyAdmin()`: Kiểm tra quyền admin
- `verifyAuthor()`: Kiểm tra quyền tác giả của question

### 4. API Endpoints với Authentication

#### Users (`/users`)
- `GET /users` - Chỉ Admin có thể truy cập

#### Questions (`/questions`)
- `GET /questions` - Ai cũng có thể truy cập
- `GET /questions/:questionId` - Ai cũng có thể truy cập
- `POST /questions` - User đã đăng nhập có thể tạo (trở thành author)
- `PUT /questions/:questionId` - Chỉ author của question có thể update
- `DELETE /questions/:questionId` - Chỉ author của question có thể delete

#### Quizzes (`/quizzes`)
- `GET /quizzes` - Ai cũng có thể truy cập
- `GET /quizzes/:quizId` - Ai cũng có thể truy cập
- `GET /quizzes/:quizId/populate` - Ai cũng có thể truy cập
- `POST /quizzes` - Chỉ Admin có thể tạo
- `PUT /quizzes/:quizId` - Chỉ Admin có thể update
- `DELETE /quizzes/:quizId` - Chỉ Admin có thể delete
- `POST /quizzes/:quizId/question` - Chỉ Admin có thể thêm question
- `POST /quizzes/:quizId/questions` - Chỉ Admin có thể thêm nhiều questions

## Cách sử dụng

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Tạo dữ liệu mẫu
```bash
node seed.js
```

### 3. Chạy server
```bash
npm start
# hoặc
npm run dev
```

Server sẽ chạy trên port 3002 (thay vì 3000).

### 4. Authentication

#### Đăng ký user mới
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"newuser","password":"password123","admin":false}' \
  http://localhost:3002/auth/register
```

#### Đăng nhập
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  http://localhost:3002/auth/login
```

### 5. Test API với JWT Token

#### Lấy danh sách users (chỉ Admin)
```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:3002/users
```

#### Tạo question (user đã đăng nhập)
```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"text":"Test question?","options":["A","B","C","D"],"correctAnswerIndex":0}' \
  http://localhost:3002/questions
```

#### Update question (chỉ author)
```bash
curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"text":"Updated question?","options":["A","B","C","D"],"correctAnswerIndex":1}' \
  http://localhost:3002/questions/<QUESTION_ID>
```

#### Delete question (chỉ author)
```bash
curl -X DELETE -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:3002/questions/<QUESTION_ID>
```

## Tài khoản mẫu
- **Admin**: username=admin, password=admin123
- **User 1**: username=user1, password=user123  
- **User 2**: username=user2, password=user123

## Phân quyền chi tiết

### Admin (admin: true)
- ✅ Xem tất cả users (`GET /users`)
- ✅ Tạo, sửa, xóa quizzes (`POST/PUT/DELETE /quizzes`)
- ✅ Tạo questions (`POST /questions`)
- ✅ Sửa, xóa questions của chính họ (`PUT/DELETE /questions/:id`)

### User thường (admin: false)
- ❌ Không thể xem users
- ❌ Không thể quản lý quizzes
- ✅ Tạo questions (`POST /questions`) - trở thành author
- ✅ Sửa, xóa questions của chính họ (`PUT/DELETE /questions/:id`)

### Không đăng nhập
- ✅ Xem questions và quizzes (`GET /questions`, `GET /quizzes`)
- ❌ Không thể tạo, sửa, xóa gì cả

## Lưu ý
- Sử dụng JWT token trong header `Authorization: Bearer <TOKEN>`
- Token có thời hạn 24 giờ
- Password được hash bằng bcrypt trước khi lưu vào database
- User tạo question sẽ tự động trở thành author của question đó
