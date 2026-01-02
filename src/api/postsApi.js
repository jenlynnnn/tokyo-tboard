//postsApi.js

import { api } from "./api";

//게시물 목록(전체조회)
// {page =0,  size=10, keyword = ''}  서버에서 넘기는 갑 없으면 자바에서 기본값으로 사용
export async function fetchPosts({ page = 0, size = 10, keyword = '' }) {
    const params = { page, size }; // 쿼리 파라미터에 넣음
    if (keyword && keyword.trim() !== '')
        params.keyword = keyword;

    //axios가  쿼리스트링을 자동으로 붙여줌 axios.get(url, {params});
    const res = await api.get('/api/posts', { params });
    return res.data;
}

//게시글 상세
export async function fetchPostsDetail(id) {
    const res = await api.get(`/api/posts/${id}`);
    return res.data;
}


//게시글 작성
export async function createPosts(payload) {
    const res = await api.post('/api/posts', payload);
    return res.data;
}


//게시글 수정
export async function updatePosts(id, payload) {
    const res = await api.put(`/api/posts/${id}`, payload);
    return res.data;
}


//게시글 삭제
export async function deletePosts(id) {
    await api.delete(`/api/posts/${id}`);
}