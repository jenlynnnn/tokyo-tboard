export default function ErrorMessage({ message = '오류발생' }) {
    return <p style={{ color: '#ff0000ff' }}>{message}</p>
}