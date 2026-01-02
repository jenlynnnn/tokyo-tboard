import { Box, Button, TextField } from '@mui/material';

function PostSearch({ keyword, onsubmit, onChangeKeyword }) {
    return (
        <Box component='form'
            onSubmit={onsubmit}
            sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mb: 2 }}>
            <TextField type="search"
                size="small"
                placeholder="제목 또는 내용 검색"
                sx={{ width: 260 }}
                value={keyword}
                onChange={(evt) => onChangeKeyword(evt.target.value)}
            />
            <Button type="submit" size="small" variant="outlined"  > 검색</Button>
        </Box>
    );
}
export default PostSearch;