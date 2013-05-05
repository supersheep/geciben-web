var request = require('request');
var url = require('url');
var _ = require('underscore');

function base(opt){
    var self = this;
    for(key in opt){
        if(key){
            self["_"+key] = opt[key]
        }
    }
}

base.prototype = {
    set_access_token : function (token){
        this._token = token;
    },

    check_err : function (json){
        code = this.str_err_code
        msg = this.str_err_msg
        if code in json{
            throw new Error(json[msg])
        }
    },

    signed_request : function (opt,cb){
        var self = this;
        if(!this._token){
            cb("no token")
        };

        request({
            method:opt.method,
            url:opt.url,
            form:opt.data,
            headers:{"Authorization":this.header_str + " " + this._token
        },function(err,res,body){
            if(err)return cb(err)
            json = JSON.parse(body)
            this.check_err(json)
            cb(null,json)
        })
    },

    signed_post : function (opt,cb){
        this.signed_request(_.extend({method:"post"},opt),cb)
    },

    signed_get : function (opt,cb){
        this.signed_request(_.extend({method:"get"},opt),cb)
    },

    get_access_token : function (code,cb){
        var name = this.name,
            data = {
                "client_id":this._key,
                "client_secret":this._secret,
                "redirect_uri":this._callback,
                "grant_type":"authorization_code",
                "code":code
            };

        request.post(this.access_token_url,{form:data},function(err,res,body){
            if(err)return cb(err)

            res_json = JSON.parse(body)
            try{
                this.check_err(res_json)
            }catch(e){
                 cb(e)
            }
            cb(null,res_json["access_token"])
        })
    },

    redirect : function (){
        var name = this.name,
            base = this.authorize_url,
            key = self._key,
            secret = self._secret,
            callback = self._callback,
            qs = url.format({query:{"redirect_uri":callback,"client_id":key,"response_type":"code"}}),
            url = base+qs;

        return url
    }
}

module.exports = oauthbase;