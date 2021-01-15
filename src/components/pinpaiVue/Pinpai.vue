<template>
    <div align="center">
    <h1>品牌数据</h1>

  <!--条件搜索-->
  <div id="searchDiv">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">

      <el-form-item label="名称:">
        <el-input v-model="searchForm.name" placeholder="请输入名字"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="queryPinpaiData(1)">查询</el-button>
        <el-button type="success" @click="addFormFlag=true">新增</el-button>
      </el-form-item>


    </el-form>
  </div>

  <!--查询表格-->
  <div id="ppTable">
    <el-table :data="pinpaiData" border style="width: 100%">

      <el-table-column prop="id" align="center" label="序号" width="180"></el-table-column>

      <el-table-column prop="name" label="姓名" width="180"></el-table-column>

      <el-table-column prop="bandE" label="品牌首字母 " width="180"></el-table-column>

      <el-table-column prop="bandDesc" label="品牌介绍 " width="180"></el-table-column>

      <el-table-column prop="ord" label="分组 " width="180"></el-table-column>


      <el-table-column prop="imgPath" label="图片">
        <!-- 按文本处理   :formatter="formatImg"    -->
        <!-- 模板处理  html  -->
        <template slot-scope="scope">
          <img width="50px" :src="'http://'+scope.row.imgPath"/>
        </template>
      </el-table-column>



      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"  v-on:click="upshow(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger" v-on:click="del(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>


    <el-pagination

      layout="total,sizes,prev,pager,next,jumper"
      :total="count"
      background
      :page-size="size"
      :page-sizes="sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>


  </div >
      <!--  新增的弹框   -->
      <el-dialog title="录入汽车信息" :visible.sync="addFormFlag" width="800px">

        <el-form :model="addpinpaiForm" ref="addpinpaiForm" :rules="rule"  label-width="80px">

          <el-form-item label="名称" prop="name">
            <el-input v-model="addpinpaiForm.name" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="首字母" prop="bandE">
            <el-input v-model="addpinpaiForm.bandE" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="品牌介绍" prop="bandDesc">
            <el-input v-model="addpinpaiForm.bandDesc" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="分组" prop="ord">
            <el-input v-model="addpinpaiForm.ord" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="创建人" prop="createPeople">
            <el-input v-model="addpinpaiForm.createPeople" autocomplete="off" ></el-input>
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

      <!--  修改的弹框   -->
      <el-dialog title="录入汽车信息" :visible.sync="upFormFlag" width="800px">

        <el-form :model="uppinpaiForm" ref="uppinpaiForm"   label-width="80px">

          <el-form-item label="序号" prop="id">
            <el-input v-model="uppinpaiForm.id" autocomplete="off" readonly=""></el-input>
          </el-form-item>

          <el-form-item label="名称" prop="name">
            <el-input v-model="uppinpaiForm.name" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="首字母" prop="bandE">
            <el-input v-model="uppinpaiForm.bandE" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="品牌介绍" prop="bandDesc">
            <el-input v-model="uppinpaiForm.bandDesc" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="分组" prop="ord">
            <el-input v-model="uppinpaiForm.ord" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="创建人" prop="createPeople">
            <el-input v-model="uppinpaiForm.createPeople" autocomplete="off" ></el-input>
          </el-form-item>


          <el-form-item label="图片">
            <img width="50px" :src="'http://'+uppinpaiForm.imgPath"/>
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
          <el-button @click="upFormFlag = false">取 消</el-button>
          <el-button type="primary" @click="upForm">确 定</el-button>
        </div>

      </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Pinpai",
      data(){
          return{
            /* 修改相关的数据  */
            upFormFlag:false,
            uppinpaiForm:{
              id:"",
              name:"",
              bandE:"",
              imgPath:"",
              bandDesc:"",
              ord:"",
              createPeople:""
            },
            /* 新增相关的数据  */
            addFormFlag:false,
            addpinpaiForm:{
              name:"",
              bandE:"",
              imgPath:"",
              bandDesc:"",
              ord:"",
              createPeople:""
            },
            rule:{ //验证规则
              name:[
                { required: true, message: '请输入名称', trigger: 'blur' },
                { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
              ]

            },
            /* 分页相关的数据  */
            count:0,
            sizes:[2,3,5,10],
            size:2,
            /*查询数据*/
            pinpaiData:[],
            /*条件查询*/
            searchForm:{
              name:""
            }

          }
      },created:function(){
        this.queryPinpaiData(1);
      },methods:{
        //删除
        del:function(index,row){
          this.$ajax.post("http://localhost:8080/api/pinpai/delDatasByid?id="+row.id).then(res=>{
            this.queryPinpaiData(1);
          }).catch(err=>console.log(err))
        },
        //修改
        upshow:function(index,row){
          console.log(row);
          this.upFormFlag=true;
          //发送请求
          this.$ajax.get("http://localhost:8080/api/pinpai/upshowData?id="+row.id).then(res=>{
            var updateData=res.data.data;

            this.uppinpaiForm.id=updateData.id;
            this.uppinpaiForm.name=updateData.name;
            this.uppinpaiForm.bandE=updateData.bandE;
            this.uppinpaiForm.imgPath=updateData.imgPath;
            this.uppinpaiForm.bandDesc=updateData.bandDesc;
            this.uppinpaiForm.ord=updateData.ord;
            this.uppinpaiForm.createPeople=updateData.createPeople;

          }).catch(err=>console.log(err))
        },upForm:function(){
          //发送请求
          this.$ajax.post("http://localhost:8080/api/pinpai/upDatas",this.$qs.stringify(this.uppinpaiForm)).then(res=>{
            this.upFormFlag=false;
            this.queryPinpaiData(1);
          }).catch(err=>console.log(err));
        },
        //新增
        addForm:function(){
          this.$refs['addpinpaiForm'].validate(res=>{
            if(res==true){
                this.$ajax.post("http://localhost:8080/api/pinpai/addDatas",this.$qs.stringify(this.addpinpaiForm)).then(rs=>{
                  //关闭弹框
                  this.addFormFlag=false;
                  this.queryPinpaiData(1);
              }).catch(err=>console.log(err))
            }
          })
        },

        //图片上传
        imgCallBack:function(response, file, fileList){ //图片上传的回调函数
          console.log(response);
          // 赋值
          this.addpinpaiForm.imgPath=response.data;
          this.uppinpaiForm.imgPath=response.data;
        },
        queryPinpaiData(currPage){
          this.$ajax.get("http://localhost:8080/api/pinpai/queryDatas?size="+this.size+"&currPage="+currPage+"&"+this.$qs.stringify(this.searchForm)).then(rs=>{
            console.log(rs);
            this.pinpaiData=rs.data.data.clist;
            this.count=rs.data.data.count;
          }).catch(err=>console.log(err))
        },handleCurrentChange:function(currPage){ //跳转页面
          console.log(currPage);
          this.queryPinpaiData(currPage);
        },handleSizeChange:function(size){ //跳转页面
          this.size=size;
          this.queryPinpaiData(1);
        }

      }
    }
</script>

<style scoped>

</style>
