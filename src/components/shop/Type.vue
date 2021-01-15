<template>
      <div>
        <h1>商品分类管理</h1>
        <el-tree :data="typeData" show-checkbox :props="defaultProps" accordion   node-key="id" default-expand-all
                 :expand-on-click-node="false">

        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button type="text" size="mini" @click="() => append(data)">
            append
          </el-button>

          <el-button type="text" size="mini" @click="() => upType(node,data)">
            Update
          </el-button>

          <el-button type="text" size="mini" @click="() => del(node,data)">
            Delete
          </el-button>
        </span>
      </span>

        </el-tree>


        <!--  新增的弹框   -->
        <el-dialog title="录入分类产品信息" :visible.sync="addFormFlag" width="500px">

          <el-form :model="addtypeForm" ref="addtypeForm"  label-width="80px">

            <el-form-item label="名称" prop="name">
              <el-input v-model="addtypeForm.name" autocomplete="off" ></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addFormFlag = false">取 消</el-button>
            <el-button type="primary" @click="addForm()">确 定</el-button>
          </div>

        </el-dialog>

        <!--  修改的弹框   -->
        <el-dialog title="录入分类产品信息" :visible.sync="upFormFlag" width="500px">

          <el-form :model="uptypeForm" ref="uptypeForm"   label-width="80px">

            <el-form-item label="名称" prop="name">
              <el-input v-model="uptypeForm.name" autocomplete="off" ></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="upFormFlag = false">取 消</el-button>
            <el-button type="primary" @click="upForm()">确 定</el-button>
          </div>

        </el-dialog>

      </div>
</template>

<script>

    export default {
        name: "Type",
        data(){
          return{
            /*新增的数据*/
            delform:{
              id:"",
              isDel:2
            },
            /*新增的数据*/
            addFormFlag:false,
            uptypeForm:{
              name:"",
              pid:""
            },
            /*修改的数据*/
            upFormFlag:false,
            addtypeForm:{
              name:"",
              id:""
            },
            typeData:[],//树的数据
            ajaxData:[],//远程请求的数据
            jsonS:"",//处理拼接数据
            defaultProps:{}
          }
      },methods:{
          del:function(node,data){//删除
            this.delform.id=data.id;

            this.$ajax.post("http://localhost:8080/api/type/upTypeDate",this.$qs.stringify(this.delform)).then(rs=>{
              //关闭弹框

              location.reload();
            }).catch(err=>console.log(err))
          },
        upType:function(node,data){//修改
          console.log(data);
          this.upFormFlag=true;
          this.uptypeForm.name=data.label;
          this.uptypeForm.id=data.id;
        },
        upForm:function(){
          this.$ajax.post("http://localhost:8080/api/type/upTypeDate",this.$qs.stringify(this.uptypeForm)).then(rs=>{
            //关闭弹框
            this.upFormFlag=false;
            location.reload();
          }).catch(err=>console.log(err))
        },
        append:function(data){//新增
          console.log(data.id);
          //开启弹框
          this.addFormFlag=true;
          this.addtypeForm.pid=data.id;

          },
        addForm:function(){
          this.$ajax.post("http://localhost:8080/api/type/addTypeDate",this.$qs.stringify(this.addtypeForm)).then(rs=>{
            //关闭弹框
            this.addFormFlag=false;
            location.reload();
          }).catch(err=>console.log(err))
        },
        childleData:function(){//处理数据typeData
              //先找到顶层节点
            for (let i = 0; i <this.ajaxData.length ; i++) {
              if(this.ajaxData[i].pid==0){
                  this.digui(this.ajaxData[i]);
                  break;
              }
            }

            this.typeData.push(JSON.parse(this.jsonS));
          },
          digui:function(node){

            //判断是否为父节点
            var fu=this.isParents(node);

            if(fu==true){
              //{"id":1,"label":"分类",}
              //{"id":1,"label":"分类","children":[]}
              this.jsonS+='{"id":'+node.id+',"label":"'+node.name+'","children":[';
              //查找吃节点的子节点
              let count=0;
              for (let i = 0; i <this.ajaxData.length ; i++) {
                //判断是否为当前节点的子节点
                if(node.id==this.ajaxData[i].pid){
                  count++;
                  this.digui(this.ajaxData[i]);
                  this.jsonS+=",";
                }

              }
              //处理多余的，号
              if(count!=0){
                this.jsonS=this.jsonS.substr(0,this.jsonS.length-1);
              }
              //拼完整的数据
              this.jsonS+=']}';

            }else{
              this.jsonS+='{"id":'+node.id+',"label":"'+node.name+'"}';
            }

    },
          isParents:function(node){//判断是否为父节点
            for (let i = 0; i <this.ajaxData.length ; i++) {
              if(node.id==this.ajaxData[i].pid){//看有没有指向当前id 的pid
                  return true;
              }
            }
              return false;
          }
      },
      created:function(){
          this.$ajax.get("http://localhost:8080/api/type/getData").then(rs=>{

            this.ajaxData=rs.data.data;//把数据赋给全局数据做处理
            this.childleData();
        }).catch(err=>console.log(err));
      }
    }
</script>

<style scoped>

</style>
