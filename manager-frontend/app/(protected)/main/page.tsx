import KnowledgeBase from './components/KnowledgeBase'
// import VideoResources from './components/VideoResources'

const MainPage = () => {
  return (
    <div className="space-y-5">
      <KnowledgeBase />
      {/* <VideoResources /> */}
      <div className="my-10 text-center">Видео контента пока нет. Следите за обновлениями!</div>
    </div>
  )
}

export default MainPage
