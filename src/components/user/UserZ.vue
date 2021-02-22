<template>
    <div>
      <h1>用户登录注册</h1>

      <el-form :model="loginUser"    label-width="80px">

      <el-form-item label="账号" prop="name">
        <el-input v-model="loginUser.name" autocomplete="off" ></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginUser.password" autocomplete="off" ></el-input>
      </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
          <el-button type="success" @click="addFormFlag=true">注册</el-button>
          <el-button type="success" @click="loginUsers">登录</el-button>
      </div>

      <!--  新增的弹框   -->
      <el-dialog title="录入用户信息" :visible.sync="addFormFlag" width="800px">

        <el-form :model="adduserForm"    label-width="80px">

          <el-form-item label="账号" prop="name">
            <el-input v-model="adduserForm.name" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="真实名字" prop="name">
            <el-input v-model="adduserForm.realName" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="name">
            <el-input type="password"  v-model="adduserForm.password" autocomplete="off" ></el-input>
          </el-form-item>


          <el-form-item label="图片">
            <el-upload
              class="upload-demo"
              action="http://localhost:8080/api/pinpai/uploadFile"
              :on-success="imgCallBack"
              name="file"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>


        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormFlag = false">取 消</el-button>
          <el-button type="primary" @click="addForm">确 定</el-button>
        </div>

      </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "UserZ",
      data(){
        return{
          /*注册的相关数据*/
          addFormFlag:false,
          adduserForm:{
            name:"",
            realName:"",
            password:"",
            imgPath:""
          },
          /*登录相关数据*/
          loginUser:{
            name:"",
            password:""
          }

        }
      },methods:{
          //新增
        addForm:function(){
          this.$ajax.post("http://localhost:8080/api/user/addUser",this.$qs.stringify(this.adduserForm)).then(res=>{
            //关闭弹框
            this.addFormFlag=false;
          }).catch(err=>console.log(err))
        },
        //图片上传
        imgCallBack:function(response, file, fileList){ //图片上传的回调函数
          console.log(response);
          // 赋值
          this.adduserForm.imgPath=response.data;

        },
        //登录
        loginUsers:function(){

          this.$ajax.get("http://localhost:8080/api/user/queryUserByname?name="+this.loginUser.name+"&password="+this.loginUser.password).then(res=>{
            console.log(res);
           if(res.data.status=="200"){

             this.$message.success("登录成功");
             this.$router.push("/");
           }else if(res.data.status=="400"){

              this.$message.success("密码不正确");
            }else if(res.data.status=="500"){

              this.$message.success("用户不存在");
            }
          }).catch(err=>console.log(err))
    }
      }

    }
</script>

<style scoped>

</style>
