const videos = [
  {
    id: "dQw4w9WgXcQ",
    title: "Video 1",
    description: "Deskripsi video pertama",
  },
  {
    id: "9bZkp7q19f0",
    title: "Video 2",
    description: "Deskripsi video kedua",
  },
]

export default function VideosPage() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Video</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videos.map((video) => (
          <div key={video.id} className="flex flex-col gap-3">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <h2 className="text-xl font-semibold">{video.title}</h2>
            <p className="text-muted-foreground">{video.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
