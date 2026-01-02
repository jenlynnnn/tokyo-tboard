import {
    Box,
    Paper,
    Typography,
} from '@mui/material';

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import PostSearch from '../../components/posts/PostSearch';
import PostTable from '../../components/posts/PostTable';
import PostPagination from '../../components/posts/PostPagination';
import { useState } from 'react';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage'
import { fetchPosts } from '../../api/postsApi'
import { useMe } from '../../hooks/useMe';
function PostList() {
    //현재 페이지 상태
    const [page, setPage] = useState(0);
    //키워드 상태
    const [keyword, setKeyword] = useState('');

    // 조회 Query
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['posts', page, keyword],
        queryFn: () => fetchPosts({ page, size: 10, keyword }),
        placeholderData: keepPreviousData //페이지 전환시 기존 데이터 유지

    });

    const { data: me, isLoading: meIsLoading } = useMe();

    if (isLoading) return <Loader />
    //if (isError) return <ErrorMessage />

    //받아온거 구조분해
    const content = data?.content || [];
    const totalPages = data?.totalPages || 0;

    //이벤트 핸들러 ===========
    //검색
    const handleSearch = (evt) => {
        evt.preventDefault();
        setPage(0);
    }

    //페이지이동
    const handlePrev = () => {
        setPage((prev) => Math.max(prev - 1, 0));
    }
    const handleNext = () => {
        setPage((prev) => prev + 1 < totalPages ? prev + 1 : prev);
    }

    return (
        <Box sx={{ px: 2, py: 2 }}>
            <Paper elevation={1}
                sx={{
                    width: '100%',
                    borderRadius: 3,
                    px: 4,
                    py: 3,
                    boxShadow: "0 10px 45px rgba(255, 247, 231, 0.94)" // 박스그림자... x축, y축 번짐 색상(rgba alpha : 투명도 0~1)
                }}>
                <Box>
                    {/* 상단 제목 */}
                    <Typography variant='h5' sx={{ fontWeight: 700, fontSize: 12, mb: 2 }}>게시물 목록</Typography>

                    {/* 검색 */}
                    <PostSearch
                        keyword={keyword}
                        onsubmit={handleSearch}
                        onChangeKeyword={setKeyword} />

                    {/* 테이블 */}
                    <PostTable posts={content} />

                    {/* 페지이내이션*/}
                    <PostPagination
                        page={page}
                        totalPages={totalPages}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        logined={!meIsLoading && !!me}
                    />
                </Box>
            </Paper>


        </Box>
    );
}

export default PostList;