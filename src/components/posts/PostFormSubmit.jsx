import { Box, Button } from '@mui/material';

function PostFormSubmit({ isEdit, uploading }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>

            <Button type="submit" variant="contained" disabled={uploading}
                sx={{
                    borderRadius: 999,
                    px: 3, fontWeight: 600
                }}>
                {isEdit ? '수정' : '등록'}
            </Button>
        </Box>
    );
}

export default PostFormSubmit;