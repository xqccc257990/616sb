function jurisdictionBtn(router, buttons) {

    let menuList = JSON.parse(sessionStorage.getItem('menuList'));
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    
    let menuName = '';
    for (let i = 0; i < menuList.length; i++) {
        let item = menuList[i];
        for (let j = 0; j < item.group.length; j++) {
            let it = item.group[j];
            if(it.path == router.path){
                menuName = it.name;
                continue;
            }
        }
    }

    let menuId = '';
    for (let i = 0; i < userInfo.menuList.length; i++) {
        let item = userInfo.menuList[i];
        if(item.title == menuName){
            menuId = item.menuId;
            break;
        }
    }

    let butList = []
    for (let i = 0; i < userInfo.menuList.length; i++) {
        let item = userInfo.menuList[i];
        if(item.parentId == menuId){
            butList.push(item);
        }
    }

    let _buttons = [];
    for (let i = 0; i < buttons.length; i++) {
        let item = buttons[i];
        if(!item.name){
            item.name = ['添加', '编辑', '删除'][item.type];
        }
        for (let j = 0; j < butList.length; j++) {
            let it = butList[j];
            if(item.name == it.title){
                _buttons.push(item);
                break;
            }
        }
    }

    return _buttons;
}