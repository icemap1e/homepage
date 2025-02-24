// 添加不同模式的书签数据
const bookmarkModes = {
    work: [
        {
            title: "工作相关",
            links: [
                { name: "邮箱", url: "https://mail.example.com" },
                { name: "文档", url: "https://docs.example.com" },
                // 添加更多工作相关链接
            ]
        },
        // 可以添加更多分类
    ],
    personal: [
        {
            title: "个人使用",
            links: [
                { name: "社交媒体", url: "https://social.example.com" },
                { name: "娱乐", url: "https://entertainment.example.com" },
                // 添加更多个人相关链接
            ]
        },
        // 可以添加更多分类
    ]
};

// 添加模式切换逻辑
let currentMode = 'work'; // 默认模式

function toggleMode() {
    currentMode = currentMode === 'work' ? 'personal' : 'work';
    updateBookmarks();
    // 保存当前模式到 localStorage
    localStorage.setItem('bookmarkMode', currentMode);
}

function updateBookmarks() {
    const bookmarksContainer = document.querySelector('.shortcuts');
    bookmarksContainer.innerHTML = ''; // 清空现有书签
    
    // 根据当前模式渲染书签
    bookmarkModes[currentMode].forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        
        const titleElement = document.createElement('h2');
        titleElement.textContent = category.title;
        categoryElement.appendChild(titleElement);
        
        const linksContainer = document.createElement('div');
        linksContainer.className = 'links';
        
        category.links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.textContent = link.name;
            linksContainer.appendChild(linkElement);
        });
        
        categoryElement.appendChild(linksContainer);
        bookmarksContainer.appendChild(categoryElement);
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    
    // 从 localStorage 获取保存的模式
    const savedMode = localStorage.getItem('bookmarkMode');
    if (savedMode) {
        currentMode = savedMode;
        updateBookmarks();
    }
    
    // 添加模式切换按钮事件监听
    document.getElementById('modeToggle').addEventListener('click', toggleMode);
}); 