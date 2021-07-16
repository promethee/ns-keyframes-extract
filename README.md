# ns-keyframes-extract
A nanoservice to extract keyframes from video files

dependencies: `ffmpeg`

usage:
```
[server:port]/?filepath=[path_to_video.mp4]
```

return: 
```
{ frameCount, path }
```
