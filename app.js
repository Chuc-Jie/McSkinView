document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const skinViewerContainer = document.querySelector('.skin-viewer');
    const btnRotate = document.getElementById('btn-rotate');
    const btnWalk = document.getElementById('btn-walk');
    const btnRun = document.getElementById('btn-run');
    const btnReset = document.getElementById('btn-reset');
    const modelType = document.getElementById('model-type');
    const skinFile = document.getElementById('skin-file');
    const skinUrl = document.getElementById('skin-url');
    const btnLoadUrl = document.getElementById('btn-load-url');
    const username = document.getElementById('username');
    const btnLoadUsername = document.getElementById('btn-load-username');

    // 当前皮肤信息
    let currentSkinInfo = {
        name: "Steve",
        url: "",
        type: "steve"
    };

    // 初始化皮肤查看器
    const skinViewer = new SkinViewer({
        container: skinViewerContainer
    });

    // 创建分享按钮
    function createShareButton() {
        const shareButtonContainer = document.createElement('div');
        shareButtonContainer.style.marginTop = '20px';
        shareButtonContainer.style.textAlign = 'center';
        
        const shareButton = document.createElement('button');
        shareButton.textContent = '生成预览链接';
        shareButton.className = 'btn';
        shareButton.id = 'btn-share';
        shareButton.style.width = '100%';
        shareButton.addEventListener('click', () => {
            const previewUrl = new URL('preview.html', window.location.href);
            previewUrl.searchParams.set('url', currentSkinInfo.url);
            previewUrl.searchParams.set('name', currentSkinInfo.name);
            previewUrl.searchParams.set('model', currentSkinInfo.type);
            
            // 创建临时输入框复制链接
            const tempInput = document.createElement('input');
            document.body.appendChild(tempInput);
            tempInput.value = previewUrl.href;
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            alert('预览链接已复制到剪贴板！');
        });
        
        shareButtonContainer.appendChild(shareButton);
        document.querySelector('.animation-controls').appendChild(shareButtonContainer);
    }
    
    // 创建分享按钮
    createShareButton();

    // 动画控制类
    const animationControls = {
        // 当前动画类名
        currentAnimation: '',

        // 移除所有动画
        removeAllAnimations() {
            skinViewerContainer.classList.remove(
                'd-skin-aciton-rotate',
                'd-skin-aciton-walk',
                'd-skin-aciton-run',
                'd-skin-aciton-rotate-paused',
                'd-skin-action-skeleton-paused'
            );
            this.currentAnimation = '';
        },

        // 添加旋转动画
        addRotate() {
            this.removeAllAnimations();
            skinViewerContainer.classList.add('d-skin-aciton-rotate');
            this.currentAnimation = 'rotate';
        },

        // 添加行走动画
        addWalk() {
            this.removeAllAnimations();
            skinViewerContainer.classList.add('d-skin-aciton-walk');
            this.currentAnimation = 'walk';
        },

        // 添加跑步动画
        addRun() {
            this.removeAllAnimations();
            skinViewerContainer.classList.add('d-skin-aciton-run');
            this.currentAnimation = 'run';
        },

        // 重置动画
        reset() {
            this.removeAllAnimations();
            // 重置主旋转
            skinViewer.resetMainRotate();
        }
    };

    // 事件监听 - 动画控制按钮
    btnRotate.addEventListener('click', () => animationControls.addRotate());
    btnWalk.addEventListener('click', () => animationControls.addWalk());
    btnRun.addEventListener('click', () => animationControls.addRun());
    btnReset.addEventListener('click', () => animationControls.reset());

    // 事件监听 - 模型类型选择
    modelType.addEventListener('change', () => {
        const type = modelType.value;
        currentSkinInfo.type = type;
        
        if (type === 'steve') {
            skinViewer.setSkinType(SkinViewer.SKIN_TYPE.STEVE);
        } else if (type === 'alex') {
            skinViewer.setSkinType(SkinViewer.SKIN_TYPE.ALEX);
        }
    });

    // 事件监听 - 文件上传
    skinFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'image/png') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const skinImage = new Image();
                skinImage.onload = () => {
                    skinViewer.setSkin(skinImage);
                    
                    // 设置当前皮肤信息
                    currentSkinInfo.name = file.name.replace('.png', '');
                    currentSkinInfo.url = e.target.result;
                };
                skinImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert('请选择PNG格式的皮肤图片！');
        }
    });

    // 事件监听 - 加载URL
    btnLoadUrl.addEventListener('click', () => {
        const url = skinUrl.value.trim();
        if (url) {
            loadSkinFromUrl(url);
            
            // 设置当前皮肤信息
            currentSkinInfo.name = '自定义皮肤';
            currentSkinInfo.url = url;
        } else {
            alert('请输入有效的皮肤URL！');
        }
    });

    // 事件监听 - 加载用户名皮肤
    btnLoadUsername.addEventListener('click', () => {
        const name = username.value.trim();
        if (name) {
            loadSkinFromUsername(name);
        } else {
            alert('请输入有效的Minecraft用户名！');
        }
    });

    // 从URL加载皮肤
    function loadSkinFromUrl(url) {
        const skinImage = new Image();
        skinImage.crossOrigin = 'Anonymous';
        skinImage.onload = () => {
            skinViewer.setSkin(skinImage);
        };
        skinImage.onerror = () => {
            alert('无法加载皮肤图片，请检查URL是否正确！');
        };
        skinImage.src = url;
    }

    // 从Minecraft用户名加载皮肤
    function loadSkinFromUsername(name) {
        // 使用Mojang API获取皮肤
        fetch(`https://api.mojang.com/users/profiles/minecraft/${name}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('无法找到该用户');
                }
                return response.json();
            })
            .then(data => {
                const uuid = data.id;
                return fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('无法获取用户信息');
                }
                return response.json();
            })
            .then(data => {
                const properties = data.properties.find(prop => prop.name === 'textures');
                if (!properties) {
                    throw new Error('无法获取皮肤信息');
                }
                
                const texturesData = JSON.parse(atob(properties.value));
                const skinUrl = texturesData.textures.SKIN.url;
                
                // 检测模型类型
                const modelInfo = texturesData.textures.SKIN.metadata;
                if (modelInfo && modelInfo.model === 'slim') {
                    skinViewer.setSkinType(SkinViewer.SKIN_TYPE.ALEX);
                    modelType.value = 'alex';
                    currentSkinInfo.type = 'alex';
                } else {
                    skinViewer.setSkinType(SkinViewer.SKIN_TYPE.STEVE);
                    modelType.value = 'steve';
                    currentSkinInfo.type = 'steve';
                }
                
                // 设置当前皮肤信息
                currentSkinInfo.name = name;
                currentSkinInfo.url = skinUrl;
                
                loadSkinFromUrl(skinUrl);
            })
            .catch(error => {
                alert(`错误：${error.message}`);
            });
    }

    // 添加拖动旋转功能
    {
        let startX = 0;
        let startY = 0;
        let defX = 0;
        let defY = 0;
        let pointDown = false;

        skinViewerContainer.addEventListener('pointerdown', (e) => {
            // 不再停止动画，而是允许在动画播放时也能拖动
            const { clientX, clientY } = e;
            startX = clientX;
            startY = clientY;
            const [a, b] = skinViewer.getMainRotate();
            defX = a;
            defY = b;
            pointDown = true;
        });

        document.addEventListener('pointermove', (e) => {
            if (!pointDown) return;
            
            const { clientX, clientY } = e;
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            skinViewer.setMainRotate(defX - deltaY * 0.5, defY + deltaX * 0.5, 0);
        });

        document.addEventListener('pointerup', () => {
            pointDown = false;
            // 如果当前没有动画，才重置旋转
            if (!animationControls.currentAnimation) {
                skinViewer.resetMainRotate();
            }
        });
    }

    // 设置默认皮肤
    // 加载Steve皮肤
    const defaultSkinUrl = "https://textures.minecraft.net/texture/1a4af718455d4aab528e7a61f86fa25e6a369d1768dcb13f7df319a713eb810b";
    currentSkinInfo.name = "Steve";
    currentSkinInfo.url = defaultSkinUrl;
    currentSkinInfo.type = "steve";
    loadSkinFromUrl(defaultSkinUrl);
}); 