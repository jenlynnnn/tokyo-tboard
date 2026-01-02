import { Box, Button, Divider, TextField, Typography, Paper, Stack, Alert } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createComment, deleteComment, fetchComments, updateComment } from '../../api/commentApi';
import Loader from '../common/Loader';
import { useState } from 'react';
import ErrorMessage from '../common/ErrorMessage';
import { useMe } from '../../hooks/useMe';

function PostComments({ postId }) {
    const queryClient = useQueryClient();
    //댓글 입력을 위한
    const [newComment, setNewComment] = useState("");
    //수정
    const [editContent, setEditContent] = useState("");
    const [editId, setEditId] = useState(null); //true면 수정 null 작성

    const { data: me, isLoading: meIsLoading } = useMe();
    const isMe = !meIsLoading && !!me;

    // TanStack Query ===============
    //조회
    const {
        data: comments = [],
        isLoading: isCommentsLoading,
        isError: isCommentsError
    } = useQuery({
        queryKey: ['postComments', postId],
        queryFn: () => fetchComments(postId)

    });

    const checkEdit = (authorId) => {
        return (
            !meIsLoading &&
            me?.id != null &&
            authorId != null &&
            Number(me.id) === Number(authorId)
            //로그인 아이디, 작성자 아이디 비교
        )
    }

    //작성
    const createCommentMutation = useMutation({
        mutationFn: (content) => createComment(postId, { content }),
        onSuccess: () => {
            setNewComment("");
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => {
            alert('댓글 등록에 실패했습니다')
        }
    });


    //수정
    const updateCommentMutation = useMutation({

        mutationFn: ({ commentId, content }) => updateComment(postId, commentId, { content }),
        onSuccess: () => {
            setEditId(null);
            setEditContent("");
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });

        },
        onError: () => {
            alert('댓글 수정에 실패했습니다')
        }

    });

    //삭제

    const deleteCommentMutation = useMutation({
        mutationFn: (commentId) => deleteComment(postId, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => {
            alert('댓글 삭제에 실패했습니다');
        }
    });


    // 이벤트 핸들러 ===================
    //작성
    const handleNewComment = (evt) => {
        evt.preventDefault();

        if (!isMe) return;                 // 로그인 안 됐으면 막기
        if (!newComment.trim()) return;  //  빈 댓글만 막기

        createCommentMutation.mutate(newComment.trim());
    };


    //수정 모드 집입
    const handleStarEdit = ({ author, id, content }) => {

        if (!checkEdit(author?.id)) return;

        setEditId(id); // 수정 중으로 변경을 위한 변수 업데이트
        setEditContent(content);// 기존 내용 출력
    }

    //수정 저장 
    const handleSaveEdit = (commentId) => {

        if (!editContent.trim()) return;
        updateCommentMutation.mutate({ commentId, content: editContent.trim() });
    }

    //수정 취소
    const handleCancelEdit = () => {
        setEditId(null);
        setEditContent("");
    }

    //삭제
    const handleDeleteComment = (commentId) => {
        const comment = comments.find((elem) => elem.id === commentId);

        if (!comment) return;
        if (!checkEdit(comment.author?.id)) {
            alert('본인의 댓글만 삭제할 수있습니다');
            return;
        }

        if (!window.confirm('댓글을 삭제하겠습니까?')) return;
        deleteCommentMutation.mutate(commentId);

    }


    return (
        <Box>
            {/* 댓글 목록 */}
            <Typography variant='h6' sx={{ fontWeight: 600, mb: 1 }}>댓글</Typography>

            {isCommentsLoading && <Loader />}
            {isCommentsError && <ErrorMessage message='댓글을 불러오지 못했습니다' />}

            {/* 댓글 리스트 */}
            {!isCommentsLoading && !isCommentsError &&
                comments.map((comment) => {
                    const { id, content, createdAt, author } = comment;

                    //본인 댓글 여부 확인
                    const loginedEdit = checkEdit(author?.id);

                    return (
                        <Paper key={id} variant='outlined' sx={{ p: 2, mb: 1.5 }}>
                            {

                                editId === id ? (
                                    <>
                                        {/* 댓글 수정 */}
                                        <TextField fullWidth
                                            value={editContent}
                                            onChange={(evt) => setEditContent(evt.target.value)}
                                        />
                                        <Stack direction="row" spacing={0.8} sx={{ mt: 1 }}>
                                            <Button size='small' variant='contained'
                                                onClick={() => handleSaveEdit(id)}>저장</Button>
                                            <Button size='small' color='inherit' variant='outlined'
                                                onClick={handleCancelEdit}>취소</Button>
                                        </Stack>
                                    </>
                                ) : (
                                    <>
                                        {/* 댓글 리스트 false */}

                                        <Typography>
                                            {content}
                                        </Typography>

                                        {/* 본인 댓글 일때만 버튼 표시 */}
                                        {loginedEdit && (

                                            <Stack direction="row" justifyContent="space-between" alignContent="flex-end" sx={{ mt: 1 }} >
                                                <Typography variant='caption'>
                                                    {author?.nickname || '익명'} - {""}
                                                    {createdAt && new Date(createdAt).toLocaleString()}

                                                </Typography>

                                                <Stack direction="row" spacing={0.8}>
                                                    <Button size='small' onClick={() => handleStarEdit(comment)}>수정</Button>
                                                    <Button size='small' color='error' onClick={() => handleDeleteComment(id)}>삭제</Button>
                                                </Stack>
                                            </Stack>
                                        )
                                        }
                                    </>
                                )
                            }

                        </Paper>
                    )
                })
            }



            {/* 댓글 작성 로그인 한 사람만 */}
            {
                isMe ? (
                    <Box component="form" sx={{ my: 2 }} onSubmit={handleNewComment}>
                        <TextField label="댓글 작성" size="small" fullWidth multiline minRows={2}
                            value={newComment}
                            onChange={(evt) => setNewComment(evt.target.value)}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type='submit' variant='contained' size="small" sx={{ borderRadius: 999, px: 1.5, mt: 1 }}>댓글 등록</Button>
                        </Box>
                    </Box>

                ) : (
                    <Alert severity='info'>댓글을 작성하려면 로그인 해주세요</Alert>
                )
            }

            <Divider sx={{ mb: 2 }} />
        </Box >
    );
}

export default PostComments;