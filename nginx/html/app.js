// API에 전송할 내용을 실제 화면의 요소에서 읽습니다. id를 유지하세요.
async function updateViews(method) {
  const response = await fetch('/api/views', {method});
  if (!response.ok) throw new Error('조회수 API 연결을 확인하세요.');
  const data = await response.json();
  document.querySelector('#view-count').textContent = data.views;
}
const message = document.querySelector('#message');
// 페이지 로드당 한 번만 증가. 다시 확인 버튼은 GET이므로 증가하지 않습니다.
updateViews('POST').catch(error => { message.textContent = error.message; });
document.querySelector('#refresh-views').addEventListener('click', async () => {
  try {
    await updateViews('GET');
    message.textContent = '현재 조회수를 다시 확인했습니다.';
  } catch (error) {
    message.textContent = error.message;
  }
});
document.querySelector('#download-button').addEventListener('click', async event => {
  const button = event.currentTarget; button.disabled = true;
  try {
    const ids = {title:'project-title',summary:'project-summary',features:'project-features',technology:'project-technology'};
    const data = Object.fromEntries(Object.entries(ids).map(([key,id]) => [key,document.getElementById(id).innerText.trim()]));
    const response = await fetch('/api/download', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    if (!response.ok) throw new Error((await response.json()).error || '다운로드 실패');
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement('a'); link.href=url;link.download='project-intro.md';document.body.append(link);link.click();link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    message.textContent = '다운로드한 파일과 화면의 소개 내용을 비교하세요.';
  } catch(error) { message.textContent = error.message; }
  finally { button.disabled = false; }
});
