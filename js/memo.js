class MemoManager {
    constructor() {
        this.memos = [];
        this.memoList = document.getElementById('memo-list');
        this.addButton = document.getElementById('add-memo');
        this.init();
    }

    init() {
        // 从本地存储加载备忘录
        const savedMemos = localStorage.getItem('memos');
        if (savedMemos) {
            this.memos = JSON.parse(savedMemos);
            this.renderMemos();
        }

        // 添加按钮点击事件
        this.addButton.addEventListener('click', () => this.showAddDialog());

        // 创建对话框
        this.createDialog();
    }

    createDialog() {
        // 创建对话框HTML
        const dialogHTML = `
            <div class="dialog-overlay" id="memo-dialog" style="display: none;">
                <div class="dialog">
                    <h2>添加备忘录</h2>
                    <input type="text" id="memo-input" placeholder="输入备忘内容...">
                    <div class="dialog-buttons">
                        <button id="cancel-memo">取消</button>
                        <button id="save-memo">保存</button>
                    </div>
                </div>
            </div>
        `;

        // 添加到body
        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        // 获取对话框元素
        this.dialog = document.getElementById('memo-dialog');
        this.memoInput = document.getElementById('memo-input');
        
        // 添加按钮事件
        document.getElementById('cancel-memo').addEventListener('click', () => this.hideDialog());
        document.getElementById('save-memo').addEventListener('click', () => this.saveMemo());

        // 添加回车键保存功能
        this.memoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveMemo();
            }
        });
    }

    showAddDialog() {
        this.dialog.style.display = 'flex';
        this.memoInput.value = '';
        this.memoInput.focus();
    }

    hideDialog() {
        this.dialog.style.display = 'none';
    }

    saveMemo() {
        const content = this.memoInput.value.trim();
        if (content) {
            const memo = {
                id: Date.now(),
                content,
                timestamp: new Date().toISOString()
            };
            this.memos.unshift(memo); // 添加到开头
            this.saveMemos();
            this.renderMemos();
            this.hideDialog();
        }
    }

    deleteMemo(id) {
        this.memos = this.memos.filter(memo => memo.id !== id);
        this.saveMemos();
        this.renderMemos();
    }

    saveMemos() {
        localStorage.setItem('memos', JSON.stringify(this.memos));
    }

    renderMemos() {
        this.memoList.innerHTML = '';
        
        // 更新统计信息
        document.getElementById('memo-total').textContent = this.memos.length;
        document.getElementById('memo-latest').textContent = 
            this.memos.length > 0 
                ? new Date(this.memos[0].timestamp).toLocaleString('zh-CN', {
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : '无';
        
        // 渲染备忘录列表
        this.memos.forEach(memo => {
            const memoElement = document.createElement('div');
            memoElement.className = 'memo-item';
            memoElement.innerHTML = `
                <span class="material-icons">note</span>
                <span class="memo-content">${memo.content}</span>
                <button class="delete-btn" onclick="memoManager.deleteMemo(${memo.id})">
                    <span class="material-icons">delete</span>
                </button>
            `;
            this.memoList.appendChild(memoElement);
        });
    }
}

// 初始化备忘录管理器
const memoManager = new MemoManager(); 