import { Box, Paper, Stack, Typography } from '@mui/material';
import PostFormFields from '../../components/posts/PostFormFields';
import PostFormImage from '../../components/posts/PostFormImage';
import PostFormSubmit from '../../components/posts/PostFormSubmit';

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPosts, updatePosts, fetchPostsDetail } from '../../api/postsApi';
import { uploadImage } from '../../api/fileApi'
import { useNavigate, useParams } from 'react-router';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

// mode: 'create' -> 새 글 작성 / mode: 'edit' -> 수정
function PostForm({ mode }) {
    const isEdit = mode === 'edit'; // 수정 모드인지 확인
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { id } = useParams();
    const postId = Number(id);

    // 폼 상태
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    //이미지
    const [imageName, setImageName] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // 수정 모드일 때 기존 데이터 조회
    const { data: post, isLoading, isError } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => fetchPostsDetail(postId),
        enabled: isEdit,
    });

    // TanStack Query: 생성
    const createMutation = useMutation({
        mutationFn: createPosts,
        onSuccess: (create) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            navigate(`/posts/${create.id}`);
        },
        onError: () => {
            alert('게시물 등록에 실패했습니다.');
        },
    });

    // TanStack Query: 수정
    const updateMutation = useMutation({
        mutationFn: (payload) => updatePosts(postId, payload),
        onSuccess: (update) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
            navigate(`/posts/${update.id}`);
        },
        onError: () => {
            alert('수정에 실패했습니다.');
        },
    });

    // 기존 데이터 form에 세팅
    {/*useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
            setImageName(post.imageName || '');
        }
    }, [post]);*/}

    //이미지 업로드 Mutation
    const uploadMutation = useMutation({
        mutationFn: (file) => uploadImage(file),
        onSuccess: (result) => {
            setImageUrl(result.imageUrl);
        },
        onError: () => {
            alert('이미지 업로드에 실패했습니다');
        }
    });

    //side effect: 렌더링 된 후 정해진 변수의 상태에 따라 실행
    //useEfect(() =< {}); 한번만 실행
    //useEfect(콜백함수, [변수]);
    useEffect(() => {
        if (isEdit && post) {
            setTitle(post.title);
            setContent(post.content);
            setImageUrl(post.imageUrl || null);
            console.log(post.imageUrl)
            //setImageName("");
        }
    }, [isEdit, post]); // 수정 모드이고 데이터가 바뀌면 실행


    //이벤트 핸들러 =======
    //이미지 업로드
    const handleImage = (evt) => {
        //JS의 Files 객체 
        const file = evt.target.files?.[0];
        if (!file) return;

        setImageName(file.name);

        if (file.size > 1024 * 1024 * 5) {
            alert('이미지는 5MB 이하만 가능합니다');
            evt.target.value = "";
            return;
        }

        uploadMutation.mutate(file);

        evt.target.value = "";
    }

    // 폼 전송 **
    const handleSubmit = (evt) => {
        evt.preventDefault();

        const payload = {
            title: title.trim(),
            content: content.trim(),
            imageUrl: imageUrl || null
        } //const payload = { title, content, imageName, imageUrl };

        if (!title.trim() || !content.trim()) {
            alert('제목과 내용은 필수입니다.');
            return;
        }

        //이미지 업로드 중이면 폼 전송 중지
        if (uploadMutation.isPending) {
            alert('이미지 업로드 중입니다');
            return;
        }


        if (isEdit) {
            updateMutation.mutate(payload); //수정
        } else {
            createMutation.mutate(payload); //작성
        }
    };

    // 로딩/에러 처리
    if (isEdit && isLoading) return <Loader />;
    if (isEdit && isError) return <ErrorMessage message="불러오지 못했습니다." />;

    return (
        <Box sx={{ px: 2, py: 6 }}>
            <Paper
                sx={{
                    width: '100%',
                    borderRadius: 3,
                    px: 4,
                    py: 3,
                    boxShadow: '0 10px 45px rgba(255, 247, 231, 0.94)',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    {isEdit ? '게시물 수정' : '새 글 작성'}
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2.5}>
                        {/* 입력 필드 */}
                        <PostFormFields
                            title={title}
                            content={content}
                            onChangeTitle={setTitle}
                            onChangeContent={setContent}
                        />

                        {/* 이미지 업로드 */}
                        <PostFormImage
                            imageName={imageName}
                            uploading={uploadMutation.isPending}
                            onChangeImage={handleImage} />

                        {/* 등록/수정 버튼 */}
                        <PostFormSubmit isEdit={isEdit}
                            uploading={uploadMutation.isPending} />
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}

export default PostForm;
