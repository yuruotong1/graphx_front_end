# 这是什么工具？

试用地址：http://120.27.201.81/#/

这是一款自动化画图工具，多说无益请看效果。

![](document/picture/show.gif)

总之有以下特色：
    
![](document/picture/feature.png)

# 如何使用？

## 语法

语法非常简单，我耍几个例子你就懂了!

```
中国-开车去->美国-坐飞机去->日本

北京-坐高铁去->上海 -坐飞机-> 日本
```

![](document/picture/example1.png)

```
中国--美国-->日本

北京-坐高铁去->上海 -坐飞机-> 日本
```

![](document/picture/example2.png)

## 修改图片

你可以随时修改图片！

graphx 会解析 url 动态生成数据，再把数据组装成图片，你可以复制下面的地址，在 graphx 上进行解析：

```
http://120.27.201.81:8888/graph/parseBase64?data=eyJzdWNjZXNzIjp0cnVlLCJncmFwaERhdGEiOnsiZWRnZUxpc3QiOlt7InNvdXJjZU5vZGUiOnsiYXZhdGFyIjoiaHR0cHM6Ly9pY29uc2FwaS5jb20vNWVlMjYwNmZlNGIwYjc4OGE5MzI5ZWUxLnN2ZyIsImlkIjoiYyIsInNlYXJjaFBpY3R1cmVOYW1lIjoiYyIsInRleHQiOiJjIn0sInRhcmdldE5vZGUiOnsiYXZhdGFyIjoiaHR0cHM6Ly9pY29uc2FwaS5jb20vNWVlMjYwNmZlNGIwYjc4OGE5MzI5ZWRiLnN2ZyIsImlkIjoiZCIsInNlYXJjaFBpY3R1cmVOYW1lIjoiZCIsInRleHQiOiJkIn0sInRleHQiOiIiLCJ0eXBlIjoiTElORV9MSU5FIn1dLCJub2RlTGlzdCI6W3siJHJlZiI6IiQuZ3JhcGhEYXRhLmVkZ2VMaXN0WzBdLnNvdXJjZU5vZGUifSx7IiRyZWYiOiIkLmdyYXBoRGF0YS5lZGdlTGlzdFswXS50YXJnZXROb2RlIn1dfSwicmF3RGF0YSI6ImMtLWQifQ==.png
```

或者直接查看该图片：

![](http://120.27.201.81:8888/graph/parseBase64?data=eyJzdWNjZXNzIjp0cnVlLCJncmFwaERhdGEiOnsiZWRnZUxpc3QiOlt7InNvdXJjZU5vZGUiOnsiYXZhdGFyIjoiaHR0cHM6Ly9pY29uc2FwaS5jb20vNWVlMjYwNmZlNGIwYjc4OGE5MzI5ZWUxLnN2ZyIsImlkIjoiYyIsInNlYXJjaFBpY3R1cmVOYW1lIjoiYyIsInRleHQiOiJjIn0sInRhcmdldE5vZGUiOnsiYXZhdGFyIjoiaHR0cHM6Ly9pY29uc2FwaS5jb20vNWVlMjYwNmZlNGIwYjc4OGE5MzI5ZWRiLnN2ZyIsImlkIjoiZCIsInNlYXJjaFBpY3R1cmVOYW1lIjoiZCIsInRleHQiOiJkIn0sInRleHQiOiIiLCJ0eXBlIjoiTElORV9MSU5FIn1dLCJub2RlTGlzdCI6W3siJHJlZiI6IiQuZ3JhcGhEYXRhLmVkZ2VMaXN0WzBdLnNvdXJjZU5vZGUifSx7IiRyZWYiOiIkLmdyYXBoRGF0YS5lZGdlTGlzdFswXS50YXJnZXROb2RlIn1dfSwicmF3RGF0YSI6ImMtLWQifQ==.png)

graphx 不存储图片，是图片的解析工，图片的相关信息会保存在 URL 中：

![](document/picture/parsePng.png)


# 其它

后端地址：https://github.com/yuruotong1/graphx_backend