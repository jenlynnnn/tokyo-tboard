import { createBrowserRouter, Navigate } from 'react-router'
import AppLayouts from '../layouts/AppLayouts'
import PostList from '../pages/posts/PostList'
import PostForm from '../pages/posts/PostForm'
import PostDetail from '../pages/posts/PostDetail'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import NotFoundPage from '../pages/NotFoundPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayouts />,
        children: [

            {
                index: true,
                //리다이렉트 컴포넌트./ 접근하면 /posts로 자동 이동
                element: <Navigate to="posts" replace />
            },
            {
                path: 'posts',
                element: <PostList />
            },
            {
                //게시물 작성
                path: 'posts/new',
                element: <PostForm mode="create" />

            },
            {
                //게시물 상세
                path: 'posts/:id',
                element: <PostDetail />

            },
            {
                //게시물 수정
                path: 'posts/:id/edit',
                element: <PostForm mode="edit" />
            },
            {   //로그인
                path: 'auth/login',
                element: <LoginPage />
            },
            { //회원가입
                path: 'auth/register',
                element: <RegisterPage />
            },
            {
                path: '*',
                element: <NotFoundPage />
            }

        ]

    }
])
