---
layout: draft
title: 2018-04-16-github上备份Hexo博客.md
tags:
  - 技术
  - git
  - hexo
date: 2018-04-16 09:06:04
---

# Github上备份Hexo博客

## 前言

配置好Git和Github环境后，Hexo博客的markdown文件备份。Git相关操作请参考[廖雪峰的Git教程](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)。

## 备份博客

假设本地Hexo博客已经初始化，如果没有配置好Hexo博客详见[「Ubuntu16.04下从零起步搭建配置github.io博客————Hexo」](https://lrscy.github.io/2017/11/10/Ubuntu-Github-io-config-Hexo)。

## 创建新分支

git可以很方便和低代价的创建新分支，可以利用git的新分支来备份博客。

本地Git建立新分支

`$ git checkout -b BRANCHNAME`

> `BRANCHNAME`是自定义的新分支的名字，建议起为`hexo`。

## 建立.gitignore

建立`.gitignore` 文件将不需要备份的文件屏蔽。参考`.gitignore`文件如下：

```
  .DS_Store
  Thumbs.db
  db.json
  *.log
  node_modules/
  public/
  *.deploy*/
```

# Github上备份

假设当前在hexo博客的根目录下。

```
$ git add .
$ git commit -m "Backup"
$ git push origin hexo
```
github上有两个分支（`master`和 `hexo`）

## 个人备份习惯

个人而言习惯先备份文件再生产博客。执行
```
$ git add .
$ git commit -m "Backup"
$ git push origin hexo
$ hexo g -d
```

## 恢复博客

### 克隆项目到本地

输入命令克隆博客必须文件（`hexo`分支）

`$ git clone https://github.com/jiaxf/jiaxf.github.io`

### 恢复博客

在克隆的文件夹下输入如下命令恢复博客：

```
$ npm install hexo
$ npm install
$ npm install hexo-deployer-git
```

> 注：不再需要执行`hexo init`命令。
