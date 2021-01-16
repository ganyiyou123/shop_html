<template>
    <div align="center">
      <h1>品牌属性的数据</h1>

      <!--条件搜索-->
      <div id="searchDiv">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">

          <el-form-item label="名称:">
            <el-input v-model="searchForm.name" placeholder="请输入名字"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="queryData(1)">查询</el-button>
            <el-button type="success" @click="addFormFlag=true">新增</el-button>
          </el-form-item>


        </el-form>
      </div>

      <!--查询表格-->
      <div id="dataTable">
        <el-table :data="dataData" border style="width: 100%">

          <el-table-column prop="id" align="center" label="序号" width="180"></el-table-column>

          <el-table-column prop="name" label="名称" width="180"></el-table-column>

          <el-table-column prop="nameCH" label="中文名称" width="180"></el-table-column>

          <el-table-column prop="typeId" label="主键 " width="180"></el-table-column>

          <el-table-column prop="type" label="属性类型 " width="180"></el-table-column>

          <el-table-column prop="isSku" label="是否为SKU " width="180"></el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <!--<el-button size="mini"  v-on:click="upshow(scope.$index, scope.row)">修改</el-button>-->
              <!--<el-button size="mini" type="danger" v-on:click="del(scope.$index, scope.row)">删除</el-button>-->
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

        <el-form :model="adddataForm" ref="adddataForm" :rules="rule"  label-width="80px">

          <el-form-item label="名称" prop="name">
            <el-input v-model="adddataForm.name" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="中午名称" prop="nameCH">
            <el-input v-model="adddataForm.nameCH" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="主键" prop="typeId">
            <el-input v-model="adddataForm.typeId" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="属性类型" prop="type">
            <el-input v-model="adddataForm.type" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="是否为SKU" prop="isSku">
            <el-input v-model="adddataForm.isSku" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="创建人" prop="createPeople">
            <el-input v-model="adddataForm.createPeople" autocomplete="off" ></el-input>
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
        name: "Data",
      data(){
          return{
            /* 新增相关的数据  */
            addFormFlag:false,
            adddataForm:{
              name:"",
              nameCH:"",
              typeId:"",
              type:"",
              isSku:"",
              createPeople:""
            },
            rule:{ //验证规则
              name:[
                { required: true, message: '请输入名称', trigger: 'blur' },
                { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
              ]

            },
            /*查询的数据*/
            dataData:{},
            /* 分页相关的数据  */
            count:0,
            sizes:[2,3,5,10],
            size:2,
            /*条件查询*/
            searchForm:{
              name:""
            }
          }
      },created:function(){
        this.queryData(1);
      },methods:{
        addForm:function(){//新增
          this.$refs['adddataForm'].validate(res=>{
            if(res==true){
              this.$ajax.post("http://localhost:8080/api/data/addDatas",this.$qs.stringify(this.adddataForm)).then(rs=>{
                //关闭弹框
                this.addFormFlag=false;
                this.queryData(1);
              }).catch(err=>console.log(err))
            }
          })
        },

          queryData(currPage){//查询
            this.$ajax.get("http://localhost:8080/api/data/queryDatas?size="+this.size+"&currPage="+currPage+"&"+this.$qs.stringify(this.searchForm)).then(rs=>{
              console.log(rs);
              this.dataData=rs.data.data.dlist;
              this.count=rs.data.data.count;
            }).catch(err=>console.log(err))
          },handleCurrentChange:function(currPage){ //跳转页面
          console.log(currPage);
          this.queryData(currPage);
        },handleSizeChange:function(size){ //跳转页面
          this.size=size;
          this.queryData(1);
        }
      }
    }
</script>

<style scoped>

</style>
