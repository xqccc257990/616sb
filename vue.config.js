module.exports = {

    devServer: {
        //proxy: 'http://localhost:3000/',
        before: function (app, server) {
            if (!this.proxy) {
                /**
                 * start--------------------用户模块模拟接口
                 */
                // app.post('/user/webLogin', (req, res) => {
                //     res.json({
                //         code: 0,
                //         msg: 'success',
                //         accessToken: 'SFD23F433RFDSF232fsfs2342DFWSF23sa',
                //         refreshToken: 'asdsdgdsgjkjk234h534k5k3h45k3k5'
                //     });
                // });
            }
        }
    }
}