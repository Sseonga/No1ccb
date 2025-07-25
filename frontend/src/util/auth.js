// utils/auth.js
export function checkLoginWithConfirm() {
  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    const goToLogin = window.confirm(
      "로그인이 필요한 기능입니다.\n로그인 페이지로 이동하시겠습니까?"
    );
    if (goToLogin) {
      window.location.href = "/user"; // 또는 useNavigate("/login") 사용
    }
    return false;
  }

  return true;
}
