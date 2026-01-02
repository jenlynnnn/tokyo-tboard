
import { Divider, Typography, Box, Chip } from '@mui/material'

function PostDetailHeader({ post }) {
    const { title, readCount, createAt, updateAt, author } = post;

    return (
        <>
            <Typography variant='h6' sx={{ fontWeight: 600, fontSize: 14, mb: 1 }}>
                {title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='body2' sx={{ color: '#86774bff' }}>
                    작성자:
                </Typography>
                <Chip label={author.nickname} size='small' sx={{
                    ml: 0.5, px: 1.5,
                    borderRadius: 999, bgcolor: 'primary.main', color: '#441313ff'
                }} />
                <Typography variant='body2' sx={{ color: '#86774bff', ml: 4 }}>
                    조회수: {readCount}
                </Typography>
            </Box>
            <Typography variant='caption' sx={{
                color: '#86774bff',
                display: 'inline-block', my: 2
            }}>
                작성일: {new Date(createAt).toLocaleString()}
                {updateAt && <> || 수정일: {new Date(updateAt).toLocaleString()}</>}
            </Typography>

            <Divider sx={{ my: 2 }} />
        </>
    );
}

export default PostDetailHeader;