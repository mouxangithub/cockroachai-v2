# cockroachai-v2 一键部署脚本


## 一键脚本使用方法
```
# 如果是ubuntu服务器，下面的指令前面都需加上sudo
# 第一步执行拉取脚本
curl -sS -O https://raw.githubusercontent.com/mouxangithub/cockroachai-v2/deploy/start.sh

# 第二步给权限
chmod +x start.sh

# 第三步执行脚本
./start.sh

# 或者一步到位
curl -sS -O https://raw.githubusercontent.com/mouxangithub/cockroachai-v2/deploy/start.sh && chmod +x start.sh && ./start.sh
# 如果是ubuntu则需要加上sudo
sudo curl -sS -O https://raw.githubusercontent.com/mouxangithub/cockroachai-v2/deploy/start.sh && sudo chmod +x start.sh && sudo ./start.sh
```
