var config = {

    userIp: 'http://10.10.10.20/hpxin/php/public/users', // 用户列表
    userInfo: 'http://10.10.10.20/hpxin/php/public/users/get', // 用户信息
    addUser: 'http://10.10.10.20/hpxin/php/public/users/add', // 添加用户 post
    editUser: 'http://10.10.10.20/hpxin/php/public/users/update', // 修改用户信息 post
    delUser: 'http://10.10.10.20/hpxin/php/public/users/delete',// 删除用户信息 post

    permissions: 'http://10.10.10.20/hpxin/php/public/permissions', // 获取功能权限列表
    permissionsGet: 'http://10.10.10.20/hpxin/php/public/permissions/get', // 获取功能权限信息
    permissionsAdd: 'http://10.10.10.20/hpxin/php/public/permissions/add', // 添加功能权限信息
    permissionsUpdate: 'http://10.10.10.20/hpxin/php/public/permissions/update', //修改功能权限信息
    permissionsDelete: 'http://10.10.10.20/hpxin/php/public/permissions/delete', //删除功能权限信息

    roleList: 'http://10.10.10.20/hpxin/php/public/role', // 角色列表
    roleInfo: 'http://10.10.10.20/hpxin/php/public/role/get',
    addRole: 'http://10.10.10.20/hpxin/php/public/role/add',
    editRole: 'http://10.10.10.20/hpxin/php/public/role/update',
    delRole: 'http://10.10.10.20/hpxin/php/public/role/delete',


    // PDU 分类信息
    pdutype: 'http://10.10.10.20/hpxin/php/public/pdutype', // 获取PDU分类列表
    pdutypeGet: 'http://10.10.10.20/hpxin/php/public/pdutype/get', // 获取PDU分类信息
    pdutypeAdd: 'http://10.10.10.20/hpxin/php/public/pdutype/add', //添加PDU分类信息
    pdutypeUpdate: 'http://10.10.10.20/hpxin/php/public/pdutype/update', //修改PDU分类信息
    pdutypeDelete: 'http://10.10.10.20/hpxin/php/public/pdutype/delete', // 删除PDU分类信息
    pduofferQuery: 'http://10.10.10.20/hpxin/php/public/pduoffer/query', // 获取分类名字

    // 单元管理
    pduarchives: 'http://10.10.10.20/hpxin/php/public/pduarchives', // 获取PDU列表
    pduarchivesGet: 'http://10.10.10.20/hpxin/php/public/pduarchives/get', //获取PDU信息
    pduarchivesAdd: 'http://10.10.10.20/hpxin/php/public/pduarchives/add',// 添加PDU信息
    pduarchivesUpdate: 'http://10.10.10.20/hpxin/php/public/pduarchives/update', // 修改PDU信息
    pduarchivesDelete: 'http://10.10.10.20/hpxin/php/public/pduarchives/delete', // 删除PDU信息

    // 报价管理
    pduoffer: 'http://10.10.10.20/hpxin/php/public/pduoffer', //获取PDU定价列表
    pduofferGet: 'http://10.10.10.20/hpxin/php/public/pduoffer/get',// 获取PDU报价信息
    pduofferAdd: 'http://10.10.10.20/hpxin/php/public/pduoffer/add', // 添加PDU报价信息
    pduofferUpdate: 'http://10.10.10.20/hpxin/php/public/pduoffer/update', // 修改PDU报价信息
    pduofferDelete: 'http://10.10.10.20/hpxin/php/public/pduoffer/delete', //删除PDU报价信息

    pduofferAuditsList: 'http://10.10.10.20/hpxin/php/public/pduoffer/auditsList', // 获取审核价格列表

    // 价格系统管理
    priceLevel: 'http://10.10.10.20/hpxin/php/public/pricelevel',//获取PDU报价列表
    priceLevelGet: 'http://10.10.10.20/hpxin/php/public/pricelevel/get',// 获取PDU报价信息
    priceLevelAdd: 'http://10.10.10.20/hpxin/php/public/pricelevel/add', // 添加PDU报价信息
    priceLevelUpdate: 'http://10.10.10.20/hpxin/php/public/pricelevel/update', // 修改PDU报价信息
    priceLevelDelete: 'http://10.10.10.20/hpxin/php/public/pricelevel/delete', //删除PDU报价信息
    auditPduoffer: 'http://10.10.10.20/hpxin/php/public/audit/pduoffer', // 提交审核PDU报价信息 price,Id，status remarks


    // 审批
    pduarchivesAuditsList: 'http://10.10.10.20/hpxin/php/public/pduarchives/auditsList',// 获取审核资料列表
    auditPduarchive: 'http://10.10.10.20/hpxin/php/public/audit/pduarchive',// 提交审核PDU信息
    auditFinish:'http://10.10.10.20/hpxin/php/public/audit/auditFinish',


    updateImage: 'http://10.10.10.20/hpxin/php/public/pduarchives/updateImage', // 上传图片

}