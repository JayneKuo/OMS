<template>
  <div class="compliance-info">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="160px"
      class="compliance-form"
    >
      <!-- Basic Declaration Info -->
      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>Basic Declaration Information</span>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Chinese Name" prop="basic.chineseName">
              <el-input
                v-model="form.basic.chineseName"
                placeholder="Enter Chinese declaration name"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="English Name" prop="basic.englishName">
              <el-input
                v-model="form.basic.englishName"
                placeholder="Enter English declaration name"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Chinese Material" prop="basic.chineseMaterial">
              <el-input
                v-model="form.basic.chineseMaterial"
                placeholder="Enter Chinese material description"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="English Material" prop="basic.englishMaterial">
              <el-input
                v-model="form.basic.englishMaterial"
                placeholder="Enter English material description"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Chinese Usage" prop="basic.chineseUsage">
              <el-input
                v-model="form.basic.chineseUsage"
                placeholder="Enter Chinese usage description"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="English Usage" prop="basic.englishUsage">
              <el-input
                v-model="form.basic.englishUsage"
                placeholder="Enter English usage description"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Brand Type" prop="basic.brandType">
              <el-select 
                v-model="form.basic.brandType" 
                placeholder="Select brand type"
                class="full-width-select"
              >
                <el-option label="OEM" value="OEM" />
                <el-option label="ODM" value="ODM" />
                <el-option label="Own Brand" value="OWN" />
                <el-option label="No Brand" value="NONE" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Export Benefits" prop="basic.exportBenefits">
              <el-select 
                v-model="form.basic.exportBenefits" 
                placeholder="Select export benefits"
                class="full-width-select"
              >
                <el-option label="None" value="NONE" />
                <el-option label="VAT Refund" value="VAT_REFUND" />
                <el-option label="Duty Free" value="DUTY_FREE" />
                <el-option label="Preferential Tariff" value="PREF_TARIFF" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Special Properties" prop="basic.specialProperties">
              <el-select
                v-model="form.basic.specialProperties"
                multiple
                collapse-tags
                collapse-tags-tooltip
                placeholder="Select special properties"
                class="full-width-select"
              >
                <el-option label="Fragile" value="FRAGILE" />
                <el-option label="Flammable" value="FLAMMABLE" />
                <el-option label="Temperature Sensitive" value="TEMP_SENSITIVE" />
                <el-option label="Moisture Sensitive" value="MOIST_SENSITIVE" />
                <el-option label="Light Sensitive" value="LIGHT_SENSITIVE" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>Import Information</span>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="8">
                         <el-form-item label="HS Code" prop="customs.hsCode">
               <el-input v-model="form.customs.hsCode" placeholder="Enter HS code">
                 <template #append>
                   <el-button @click="handleHsCodeLookup">Search</el-button>
                 </template>
               </el-input>
             </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Country of Origin" prop="customs.countryOfOrigin">
              <el-select v-model="form.customs.countryOfOrigin" placeholder="Select country of origin">
                <el-option
                  v-for="country in countries"
                  :key="country.code"
                  :label="country.name"
                  :value="country.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Declared Value" prop="customs.declaredValue">
              <el-input-number
                v-model="form.customs.declaredValue"
                :precision="2"
                :step="0.01"
                :min="0"
                placeholder="Enter declared value"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Duty Rate" prop="customs.dutyRate">
              <el-input-number
                v-model="form.customs.dutyRate"
                :precision="2"
                :step="0.01"
                :min="0"
                :max="100"
                placeholder="Enter duty rate"
              >
                <template #append>%</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="VAT Rate" prop="customs.vatRate">
              <el-input-number
                v-model="form.customs.vatRate"
                :precision="2"
                :step="0.01"
                :min="0"
                :max="100"
                placeholder="Enter VAT rate"
              >
                <template #append>%</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Declared Unit" prop="customs.declaredUnit">
              <el-select v-model="form.customs.declaredUnit" placeholder="Select declared unit">
                <el-option label="Pieces" value="PCS" />
                <el-option label="Sets" value="SET" />
                <el-option label="Kilograms" value="KG" />
                <el-option label="Meters" value="M" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Declared Description" prop="customs.declaredDescription">
          <el-input
            v-model="form.customs.declaredDescription"
            type="textarea"
            :rows="3"
            placeholder="Enter declared description"
          />
        </el-form-item>

        <el-divider content-position="left">Required Certificates</el-divider>

        <!-- 进口证书上传区域 -->
        <div v-if="requiredCertificates.import.length > 0" class="certificate-list">
          <div v-for="cert in requiredCertificates.import" :key="cert.key" class="certificate-item">
            <span class="certificate-name">{{ cert.name }}</span>
            <el-upload
              class="certificate-upload"
              action="#"
              :auto-upload="false"
              :on-change="(file) => handleCertificateUpload('import', cert.key, file)"
            >
              <el-button type="primary">Upload</el-button>
            </el-upload>
          </div>
        </div>

        <!-- CIQ证书上传区域 -->
        <div v-if="requiredCertificates.ciq.length > 0" class="certificate-list">
          <div v-for="cert in requiredCertificates.ciq" :key="cert.key" class="certificate-item">
            <span class="certificate-name">{{ cert.name }}</span>
            <el-upload
              class="certificate-upload"
              action="#"
              :auto-upload="false"
              :on-change="(file) => handleCertificateUpload('ciq', cert.key, file)"
            >
              <el-button type="primary">Upload</el-button>
            </el-upload>
          </div>
        </div>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <div class="left">
              <span>Compliance Certification</span>
              <el-tag :type="getComplianceStatusType(form.complianceStatus)">
                {{ getComplianceStatusText(form.complianceStatus) }}
              </el-tag>
            </div>
            <div class="right">
              <el-button-group>
                <el-button
                  type="primary"
                  link
                  :icon="Refresh"
                  @click="refreshComplianceStatus"
                >
                  Refresh Status
                </el-button>
                <el-button
                  type="primary"
                  link
                  :icon="InfoFilled"
                  @click="showComplianceGuide"
                >
                  Compliance Guide
                </el-button>
              </el-button-group>
            </div>
          </div>
        </template>

        <el-tabs v-model="activeTab">
          <el-tab-pane label="Basic Certification" name="basic">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="认证类型" prop="certifications">
                  <el-checkbox-group v-model="form.certifications">
                    <el-checkbox label="CE">CE认证</el-checkbox>
                    <el-checkbox label="FCC">FCC认证</el-checkbox>
                    <el-checkbox label="RoHS">RoHS认证</el-checkbox>
                    <el-checkbox label="FDA">FDA认证</el-checkbox>
                    <el-checkbox label="UL">UL认证</el-checkbox>
                    <el-checkbox label="CPSIA">CPSIA认证</el-checkbox>
                    <el-checkbox label="ASTM">ASTM认证</el-checkbox>
                    <el-checkbox label="REACH">REACH认证</el-checkbox>
                    <el-checkbox label="CPC">CPC认证</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="限制类型" prop="restrictions">
                  <el-checkbox-group v-model="form.restrictions">
                    <el-checkbox label="BATTERY">含电池</el-checkbox>
                    <el-checkbox label="LIQUID">液体</el-checkbox>
                    <el-checkbox label="POWDER">粉末</el-checkbox>
                    <el-checkbox label="MAGNETIC">带磁</el-checkbox>
                    <el-checkbox label="HAZMAT">危险品</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-table :data="form.certificationDetails" border style="width: 100%">
              <el-table-column label="认证类型" prop="type" width="150">
                <template #default="{ row }">
                  <el-select v-model="row.type" placeholder="请选择认证类型">
                    <el-option label="CE认证" value="CE" />
                    <el-option label="FCC认证" value="FCC" />
                    <el-option label="RoHS认证" value="RoHS" />
                    <el-option label="FDA认证" value="FDA" />
                    <el-option label="UL认证" value="UL" />
                    <el-option label="CPSIA认证" value="CPSIA" />
                    <el-option label="ASTM认证" value="ASTM" />
                    <el-option label="REACH认证" value="REACH" />
                    <el-option label="CPC认证" value="CPC" />
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="证书编号" prop="certificateNo">
                <template #default="{ row }">
                  <el-input v-model="row.certificateNo" placeholder="请输入证书编号" />
                </template>
              </el-table-column>

              <el-table-column label="发证机构" prop="issuingBody" width="180">
                <template #default="{ row }">
                  <el-input v-model="row.issuingBody" placeholder="请输入发证机构" />
                </template>
              </el-table-column>

              <el-table-column label="发证日期" prop="issueDate" width="180">
                <template #default="{ row }">
                  <el-date-picker
                    v-model="row.issueDate"
                    type="date"
                    placeholder="请选择发证日期"
                  />
                </template>
              </el-table-column>

              <el-table-column label="有效期至" prop="expiryDate" width="180">
                <template #default="{ row }">
                  <el-date-picker
                    v-model="row.expiryDate"
                    type="date"
                    placeholder="请选择有效期"
                  >
                    <template #default="{ item }">
                      <div :class="{ 'expiring': isExpiringSoon(item.value) }">
                        {{ item.label }}
                      </div>
                    </template>
                  </el-date-picker>
                </template>
              </el-table-column>

              <el-table-column label="状态" prop="status" width="120">
                <template #default="{ row }">
                  <el-tag :type="getCertificationStatusType(row.status)">
                    {{ getCertificationStatusText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="150" fixed="right">
                <template #default="{ row, $index }">
                  <el-button-group>
                    <el-button
                      type="primary"
                      link
                      :icon="Plus"
                      @click="handleUploadAttachment($index)"
                    >
                      附件
                    </el-button>
                    <el-button
                      type="danger"
                      link
                      :icon="Delete"
                      @click="handleRemoveCertification($index)"
                    >
                      删除
                    </el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>

            <div class="table-footer">
              <el-button type="primary" link :icon="Plus" @click="handleAddCertification">
                添加认证
              </el-button>
            </div>
          </el-tab-pane>

          <el-tab-pane label="Hazardous Materials" name="hazmat" v-if="requiresHazmatInfo">
            <el-form-item label="UN编号" prop="hazmat.unNumber">
              <el-input v-model="form.hazmat.unNumber" placeholder="请输入UN编号">
                <template #append>
                  <el-button @click="handleUnNumberLookup">查询</el-button>
                </template>
              </el-input>
            </el-form-item>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="危险品等级" prop="hazmat.class">
                  <el-select v-model="form.hazmat.class" placeholder="请选择危险品等级">
                    <el-option label="1类 - 爆炸品" value="1" />
                    <el-option label="2类 - 气体" value="2" />
                    <el-option label="3类 - 易燃液体" value="3" />
                    <el-option label="4类 - 易燃固体" value="4" />
                    <el-option label="5类 - 氧化剂" value="5" />
                    <el-option label="6类 - 毒性物质" value="6" />
                    <el-option label="7类 - 放射性物质" value="7" />
                    <el-option label="8类 - 腐蚀性物质" value="8" />
                    <el-option label="9类 - 其他危险品" value="9" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="包装等级" prop="hazmat.packingGroup">
                  <el-select v-model="form.hazmat.packingGroup" placeholder="请选择包装等级">
                    <el-option label="I类 - 高度危险" value="I" />
                    <el-option label="II类 - 中度危险" value="II" />
                    <el-option label="III类 - 低度危险" value="III" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="应报数量" prop="hazmat.reportableQuantity">
                  <el-input-number
                    v-model="form.hazmat.reportableQuantity"
                    :min="0"
                    placeholder="请输入应报数量"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="运输专用名称" prop="hazmat.properShippingName">
              <el-input v-model="form.hazmat.properShippingName" placeholder="请输入运输专用名称" />
            </el-form-item>

            <el-form-item label="技术名称" prop="hazmat.technicalName">
              <el-input v-model="form.hazmat.technicalName" placeholder="请输入技术名称" />
            </el-form-item>

            <el-form-item label="紧急联系方式" prop="hazmat.emergencyContact">
              <el-input v-model="form.hazmat.emergencyContact" placeholder="请输入紧急联系方式" />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="Battery Information" name="battery" v-if="requiresBatteryInfo">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="电池类型" prop="battery.type">
                  <el-select v-model="form.battery.type" placeholder="请选择电池类型">
                    <el-option label="锂离子电池" value="lithium-ion" />
                    <el-option label="锂金属电池" value="lithium-metal" />
                    <el-option label="碱性电池" value="alkaline" />
                    <el-option label="其他" value="other" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="电池配置" prop="battery.configuration">
                  <el-select v-model="form.battery.configuration" placeholder="请选择电池配置">
                    <el-option label="内置电池" value="contained-in-equipment" />
                    <el-option label="随设备包装" value="packed-with-equipment" />
                    <el-option label="独立电池" value="standalone" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="电池数量" prop="battery.cellCount">
                  <el-input-number
                    v-model="form.battery.cellCount"
                    :min="0"
                    placeholder="请输入电池数量"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="瓦时数" prop="battery.wattHourRating">
                  <el-input-number
                    v-model="form.battery.wattHourRating"
                    :min="0"
                    :precision="2"
                    placeholder="请输入瓦时数"
                  >
                    <template #append>Wh</template>
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="锂含量" prop="battery.lithiumContent">
                  <el-input-number
                    v-model="form.battery.lithiumContent"
                    :min="0"
                    :precision="2"
                    placeholder="请输入锂含量"
                  >
                    <template #append>g</template>
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="FDA Compliance" name="fda" v-if="requiresFDAInfo">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="FDA注册号" prop="fda.registrationNumber">
                  <el-input
                    v-model="form.fda.registrationNumber"
                    placeholder="请输入FDA注册号"
                  >
                    <template #append>
                      <el-button @click="verifyFDARegistration">验证</el-button>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品代码" prop="fda.productCode">
                  <el-input
                    v-model="form.fda.productCode"
                    placeholder="请输入产品代码"
                  >
                    <template #append>
                      <el-button @click="lookupProductCode">查询</el-button>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="医疗器械" prop="fda.medicalDevice">
                  <el-switch v-model="form.fda.medicalDevice" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="器械列表号"
                  prop="fda.deviceListing"
                  v-if="form.fda.medicalDevice"
                >
                  <el-input
                    v-model="form.fda.deviceListing"
                    placeholder="请输入器械列表号"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="标签审查" prop="fda.labelingReview">
                  <el-switch v-model="form.fda.labelingReview" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="药品列表号" prop="fda.drugListing">
                  <el-input
                    v-model="form.fda.drugListing"
                    placeholder="请输入药品列表号"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="食品设施注册" prop="fda.foodFacility">
                  <el-input
                    v-model="form.fda.foodFacility"
                    placeholder="请输入食品设施注册号"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="CPSIA Compliance" name="cpsia" v-if="requiresCPSIAInfo">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="年龄等级" prop="cpsia.ageGrade">
                  <el-select v-model="form.cpsia.ageGrade" placeholder="请选择年龄等级">
                    <el-option label="0-3个月" value="0-3m" />
                    <el-option label="3-6个月" value="3-6m" />
                    <el-option label="6-9个月" value="6-9m" />
                    <el-option label="9-12个月" value="9-12m" />
                    <el-option label="12-18个月" value="12-18m" />
                    <el-option label="18-24个月" value="18-24m" />
                    <el-option label="2-3岁" value="2-3y" />
                    <el-option label="3-4岁" value="3-4y" />
                    <el-option label="4-5岁" value="4-5y" />
                    <el-option label="5-6岁" value="5-6y" />
                    <el-option label="6-8岁" value="6-8y" />
                    <el-option label="8-12岁" value="8-12y" />
                    <el-option label="12岁以上" value="12y+" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="测试实验室" prop="cpsia.testingLab">
                  <el-input
                    v-model="form.cpsia.testingLab"
                    placeholder="请输入测试实验室"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="追踪标签" prop="cpsia.trackingLabel">
                  <el-input
                    v-model="form.cpsia.trackingLabel"
                    placeholder="请输入追踪标签"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="小零件警告" prop="cpsia.smallPartsWarning">
                  <el-switch v-model="form.cpsia.smallPartsWarning" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="铅含量测试" prop="cpsia.leadContent">
                  <el-switch v-model="form.cpsia.leadContent" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="邻苯二甲酸酯测试" prop="cpsia.phthalatesTest">
                  <el-switch v-model="form.cpsia.phthalatesTest" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="Prop 65 Warning" name="prop65" v-if="requiresProp65Warning">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="警告类型" prop="prop65.warningType">
                  <el-radio-group v-model="form.prop65.warningType">
                    <el-radio label="short-form">短格式警告</el-radio>
                    <el-radio label="long-form">长格式警告</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="暴露类型" prop="prop65.exposureType">
                  <el-select v-model="form.prop65.exposureType" placeholder="请选择暴露类型">
                    <el-option label="消费品" value="consumer-product" />
                    <el-option label="环境暴露" value="environmental" />
                    <el-option label="职业暴露" value="occupational" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="化学物质" prop="prop65.chemicals">
              <el-select
                v-model="form.prop65.chemicals"
                multiple
                filterable
                allow-create
                placeholder="请选择或输入化学物质"
              >
                <el-option
                  v-for="chemical in prop65Chemicals"
                  :key="chemical"
                  :label="chemical"
                  :value="chemical"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="警告语言" prop="prop65.warningLanguage">
              <el-tabs type="border-card">
                <el-tab-pane label="英文" name="en">
                  <el-input
                    v-model="form.prop65.warningLanguage.en"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入英文警告语言"
                  />
                </el-tab-pane>
                <el-tab-pane label="西班牙语" name="es">
                  <el-input
                    v-model="form.prop65.warningLanguage.es"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入西班牙语警告语言"
                  />
                </el-tab-pane>
              </el-tabs>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>Export Information</span>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="ECCN Code" prop="eccnCode">
              <el-input v-model="form.eccnCode" placeholder="Enter ECCN code" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Control Class" prop="exportControlClass">
              <el-select v-model="form.exportControlClass" placeholder="Select control class">
                <el-option label="No Control" value="NONE" />
                <el-option label="Low Control" value="LOW" />
                <el-option label="Medium Control" value="MEDIUM" />
                <el-option label="High Control" value="HIGH" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="License Required" prop="licenseRequired">
              <el-switch v-model="form.licenseRequired" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Export Duty Rate" prop="export.dutyRate">
              <el-input-number
                v-model="form.export.dutyRate"
                :precision="2"
                :step="0.01"
                :min="0"
                :max="100"
                placeholder="Enter export duty rate"
              >
                <template #append>%</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Export VAT Rate" prop="export.vatRate">
              <el-input-number
                v-model="form.export.vatRate"
                :precision="2"
                :step="0.01"
                :min="0"
                :max="100"
                placeholder="Enter export VAT rate"
              >
                <template #append>%</template>
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Control Notes" prop="exportControlNotes">
          <el-input
            v-model="form.exportControlNotes"
            type="textarea"
            :rows="3"
            placeholder="Enter control notes"
          />
        </el-form-item>

        <el-divider content-position="left">Export Certificates</el-divider>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Export License" prop="export.exportLicense">
              <el-input v-model="form.export.exportLicense" placeholder="Enter export license number">
                <template #append>
                  <el-button @click="verifyExportLicense">Verify</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="License Expiry" prop="export.exportLicenseExpiry">
              <el-date-picker
                v-model="form.export.exportLicenseExpiry"
                type="date"
                placeholder="Select expiry date"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="License Status" prop="export.exportLicenseStatus">
              <el-tag :type="getLicenseStatusType(form.export.exportLicenseStatus)">
                {{ getLicenseStatusText(form.export.exportLicenseStatus) }}
              </el-tag>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 出口证书上传区域 -->
        <div v-if="requiredCertificates.export.length > 0" class="certificate-list">
          <div v-for="cert in requiredCertificates.export" :key="cert.key" class="certificate-item">
            <span class="certificate-name">{{ cert.name }}</span>
            <el-upload
              class="certificate-upload"
              action="#"
              :auto-upload="false"
              :on-change="(file) => handleCertificateUpload('export', cert.key, file)"
            >
              <el-button type="primary">Upload</el-button>
            </el-upload>
          </div>
        </div>

        <el-divider content-position="left">Special Requirements</el-divider>
        <el-form-item>
          <el-checkbox-group v-model="form.export.specialRequirements">
            <el-checkbox v-for="req in specialRequirementOptions" :key="req.value" :label="req.value">
              {{ req.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Delete, Refresh, InfoFilled, Warning } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import type {
  ComplianceSettings,
  CertificationType,
  RestrictionType,
  ExportControlClass,
  CertificationDetail,
  HazmatInfo,
  BatteryInfo,
  FDAInfo,
  CPSIAInfo,
  Prop65Info
} from '@/types/compliance';

const props = defineProps<{
  form: ComplianceSettings
}>();

// 标签页状态
const activeTab = ref('customs');

// 计算属性
const requiresHazmatInfo = computed(() => {
  return form.restrictions?.includes('HAZMAT');
});

const requiresBatteryInfo = computed(() => {
  return form.restrictions?.includes('BATTERY');
});

const requiresFDAInfo = computed(() => {
  const fdaCategories = ['food', 'drug', 'medical-device', 'cosmetic'];
  return form.marketAccess?.us?.fdaRegistration || 
    form.certifications?.includes('FDA') ||
    fdaCategories.some(cat => form.customs?.hsCode?.startsWith(cat));
});

const requiresCPSIAInfo = computed(() => {
  const childrenCategories = ['toys', 'childcare', 'children-apparel'];
  return childrenCategories.some(cat => form.customs?.hsCode?.startsWith(cat));
});

const requiresProp65Warning = computed(() => {
  return form.marketAccess?.us?.prop65?.requiresWarning;
});

const emit = defineEmits(['update:form']);

const formRef = ref<FormInstance>();
const form = reactive(props.form);

// 模拟数据
const countries = [
  { code: 'CN', name: '中国' },
  { code: 'US', name: '美国' },
  { code: 'GB', name: '英国' },
  { code: 'DE', name: '德国' },
  { code: 'FR', name: '法国' },
  { code: 'IT', name: '意大利' },
  { code: 'JP', name: '日本' },
];

// 特殊要求选项
const specialRequirementOptions = [
  { label: 'Quota Control', value: 'QUOTA' },
  { label: 'Temporary Export', value: 'TEMP' },
  { label: 'Re-Export', value: 'RE_EXPORT' },
  { label: 'Processing Trade', value: 'PROCESSING' },
  { label: 'Bonded Area', value: 'BONDED' }
];

// 证书映射表
const certificateMap = {
  import: {
    QUARANTINE: { name: 'Quarantine Permit', key: 'quarantine' },
    FOOD: { name: 'Food Import License', key: 'food' },
    DRUG: { name: 'Drug Import License', key: 'drug' },
    COSMETICS: { name: 'Cosmetics Import License', key: 'cosmetics' },
    MEDICAL: { name: 'Medical Device License', key: 'medical' },
    CHEMICAL: { name: 'Chemical Import License', key: 'chemical' }
  },
  ciq: {
    QUALITY: { name: 'Quality Inspection Report', key: 'quality' },
    SAFETY: { name: 'Safety Testing Report', key: 'safety' },
    HEALTH: { name: 'Health Quarantine Report', key: 'health' },
    ANIMAL: { name: 'Animal Quarantine Report', key: 'animal' },
    PLANT: { name: 'Plant Quarantine Report', key: 'plant' }
  },
  export: {
    COO: { name: 'Certificate of Origin', key: 'coo' },
    EQL: { name: 'Export Quality License', key: 'eql' },
    PHYTO: { name: 'Phytosanitary Certificate', key: 'phyto' },
    HEALTH: { name: 'Health Certificate', key: 'health' },
    FSC: { name: 'Free Sale Certificate', key: 'fsc' },
    IC: { name: 'Inspection Certificate', key: 'ic' }
  }
};

// 计算需要的证书
const requiredCertificates = computed(() => {
  const result = {
    import: [] as { name: string; key: string }[],
    ciq: [] as { name: string; key: string }[],
    export: [] as { name: string; key: string }[]
  };

  // 根据选择的许可类型添加进口证书
  form.customs.importPermits.forEach(permit => {
    if (certificateMap.import[permit]) {
      result.import.push(certificateMap.import[permit]);
    }
  });

  // 根据选择的CIQ要求添加检验报告
  form.customs.ciqRequirements.forEach(req => {
    if (certificateMap.ciq[req]) {
      result.ciq.push(certificateMap.ciq[req]);
    }
  });

  // 根据选择的出口证书类型添加出口证书
  if (form.export.selectedCertificates) {
    form.export.selectedCertificates.forEach(cert => {
      if (certificateMap.export[cert]) {
        result.export.push(certificateMap.export[cert]);
      }
    });
  }

  return result;
});

// 处理证书上传
const handleCertificateUpload = (type: 'import' | 'export' | 'ciq', key: string, file: any) => {
  const target = type === 'ciq' ? form.customs.ciqCertificates : 
                type === 'export' ? form.export.certificates :
                form.customs.certificates;
  
  if (!target[key]) {
    target[key] = {};
  }
  
  if (!target[key].attachments) {
    target[key].attachments = [];
  }
  
  target[key].attachments.push({
    name: file.name,
    url: URL.createObjectURL(file.raw)
  });
  
  ElMessage.success(`${file.name} uploaded successfully`);
};

// 验证证书
const verifyCertificate = async (type: 'import' | 'export', key: string) => {
  try {
    // TODO: 调用API验证证书
    ElMessage.success(`Certificate verification successful`);
  } catch (error) {
    ElMessage.error(`Certificate verification failed`);
  }
};

const prop65Chemicals = [
  'Lead',
  'Mercury',
  'Cadmium',
  'Phthalates',
  'BPA',
  'Formaldehyde'
];

// 获取合规状态样式
const getComplianceStatusType = (status?: string) => {
  const types: Record<string, string> = {
    compliant: 'success',
    'non-compliant': 'danger',
    'pending-review': 'warning',
    exempted: 'info'
  };
  return types[status || ''] || 'info';
};

// 获取合规状态文本
const getComplianceStatusText = (status?: string) => {
  const texts: Record<string, string> = {
    compliant: '合规',
    'non-compliant': '不合规',
    'pending-review': '待审核',
    exempted: '豁免'
  };
  return texts[status || ''] || '未知';
};

// 获取认证状态样式
const getCertificationStatusType = (status?: string) => {
  const types: Record<string, string> = {
    valid: 'success',
    expired: 'danger',
    pending: 'warning'
  };
  return types[status || ''] || 'info';
};

// 获取认证状态文本
const getCertificationStatusText = (status?: string) => {
  const texts: Record<string, string> = {
    valid: '有效',
    expired: '已过期',
    pending: '待更新'
  };
  return texts[status || ''] || '未知';
};

// 获取许可证状态样式
const getLicenseStatusType = (status?: string) => {
  const types: Record<string, string> = {
    valid: 'success',
    expired: 'danger',
    pending: 'warning',
    suspended: 'info'
  };
  return types[status || ''] || 'info';
};

// 获取许可证状态文本
const getLicenseStatusText = (status?: string) => {
  const texts: Record<string, string> = {
    valid: 'Valid',
    expired: 'Expired',
    pending: 'Pending',
    suspended: 'Suspended'
  };
  return texts[status || ''] || 'Unknown';
};

// 检查是否即将过期
const isExpiringSoon = (date: string) => {
  if (!date) return false;
  const expiryDate = new Date(date);
  const now = new Date();
  const days = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return days <= 30 && days > 0;
};

// 表单验证规则
const rules = {
  'basic.chineseName': [{ required: true, message: 'Please enter Chinese declaration name', trigger: 'blur' }],
  'basic.englishName': [{ required: true, message: 'Please enter English declaration name', trigger: 'blur' }],
  'basic.chineseMaterial': [{ required: true, message: 'Please enter Chinese material description', trigger: 'blur' }],
  'basic.englishMaterial': [{ required: true, message: 'Please enter English material description', trigger: 'blur' }],
  'basic.chineseUsage': [{ required: true, message: 'Please enter Chinese usage description', trigger: 'blur' }],
  'basic.englishUsage': [{ required: true, message: 'Please enter English usage description', trigger: 'blur' }],
  'basic.brandType': [{ required: true, message: 'Please select brand type', trigger: 'change' }],
  'basic.exportBenefits': [{ required: true, message: 'Please select export benefits', trigger: 'change' }],
     'customs.hsCode': [{ required: true, message: 'Please enter HS code', trigger: 'blur' }],
   'customs.countryOfOrigin': [{ required: true, message: 'Please select country of origin', trigger: 'change' }],
   'customs.declaredValue': [{ required: true, message: 'Please enter declared value', trigger: 'blur' }],
   'customs.declaredUnit': [{ required: true, message: 'Please select declared unit', trigger: 'change' }],
   'customs.declaredDescription': [{ required: true, message: 'Please enter declared description', trigger: 'blur' }],
  'hazmat.unNumber': [{
    required: true,
    message: '请输入UN编号',
    trigger: 'blur',
    validator: (rule: any, value: any) => {
      return requiresHazmatInfo.value ? !!value : true;
    }
  }],
  'battery.type': [{
    required: true,
    message: '请选择电池类型',
    trigger: 'change',
    validator: (rule: any, value: any) => {
      return requiresBatteryInfo.value ? !!value : true;
    }
  }],
  'fda.registrationNumber': [{
    required: true,
    message: '请输入FDA注册号',
    trigger: 'blur',
    validator: (rule: any, value: any) => {
      return requiresFDAInfo.value ? !!value : true;
    }
  }],
  'cpsia.ageGrade': [{
    required: true,
    message: '请选择年龄等级',
    trigger: 'change',
    validator: (rule: any, value: any) => {
      return requiresCPSIAInfo.value ? !!value : true;
    }
  }],
  'prop65.warningType': [{
    required: true,
    message: '请选择警告类型',
    trigger: 'change',
    validator: (rule: any, value: any) => {
      return requiresProp65Warning.value ? !!value : true;
    }
  }]
};

// 查询HS编码并检查所需证书
const handleHsCodeLookup = async () => {
  try {
    // TODO: 调用 API 查询 HS 编码
    ElMessage.success('HS编码查询成功');
    checkRequiredCertificates();
  } catch (error) {
    ElMessage.error('HS编码查询失败');
  }
};

// 检查所需证书
const checkRequiredCertificates = () => {
  const hsCode = form.customs.hsCode;
  const suggestions: {
    import: string[];
    export: string[];
    ciq: string[];
    message: string;
  } = {
    import: [],
    export: [],
    ciq: [],
    message: ''
  };

  // 根据HS编码前缀判断商品类型和所需证书
  if (hsCode.startsWith('01') || hsCode.startsWith('02') || hsCode.startsWith('03')) {
    // 动物和动物产品
    suggestions.import.push('QUARANTINE');
    suggestions.ciq.push('ANIMAL');
    suggestions.export.push('HEALTH');
    suggestions.message = '该商品属于动物及其产品类，需要动物检疫证书和卫生证书。';
  } else if (hsCode.startsWith('06') || hsCode.startsWith('07') || hsCode.startsWith('08')) {
    // 植物和植物产品
    suggestions.import.push('QUARANTINE');
    suggestions.ciq.push('PLANT');
    suggestions.export.push('PHYTO');
    suggestions.message = '该商品属于植物及其产品类，需要植物检疫证书。';
  } else if (hsCode.startsWith('30')) {
    // 药品
    suggestions.import.push('DRUG');
    suggestions.ciq.push('HEALTH');
    suggestions.export.push('FSC');
    suggestions.message = '该商品属于药品类，需要药品进口许可证和自由销售证明。';
  } else if (hsCode.startsWith('33')) {
    // 化妆品
    suggestions.import.push('COSMETICS');
    suggestions.ciq.push('QUALITY');
    suggestions.export.push('FSC');
    suggestions.message = '该商品属于化妆品类，需要化妆品进口许可证和质量检验证书。';
  } else if (hsCode.startsWith('90')) {
    // 医疗器械
    suggestions.import.push('MEDICAL');
    suggestions.ciq.push('QUALITY');
    suggestions.export.push('FSC');
    suggestions.message = '该商品属于医疗器械类，需要医疗器械注册证和质量体系认证。';
  } else if (hsCode.startsWith('28') || hsCode.startsWith('29')) {
    // 化学品
    suggestions.import.push('CHEMICAL');
    suggestions.ciq.push('SAFETY');
    suggestions.export.push('IC');
    suggestions.message = '该商品属于化学品类，需要危险化学品进口许可证和安全数据表。';
  }

  // 如果有建议的证书
  if (suggestions.message) {
    // 更新表单数据
    form.customs.importPermits = [...new Set([...form.customs.importPermits, ...suggestions.import])];
    form.customs.ciqRequirements = [...new Set([...form.customs.ciqRequirements, ...suggestions.ciq])];
    form.export.certificates = [...new Set([...form.export.certificates, ...suggestions.export])];

    // 显示提示信息
    ElMessageBox.alert(
      suggestions.message + '<br><br>' +
      '建议的进口许可类型：' + suggestions.import.join(', ') + '<br>' +
      '建议的CIQ要求：' + suggestions.ciq.join(', ') + '<br>' +
      '建议的出口证书：' + suggestions.export.join(', '),
      '证书要求提示',
      {
        dangerouslyUseHTMLString: true,
        type: 'info',
        callback: () => {
          ElMessage({
            type: 'info',
            message: '已自动选择建议的证书类型'
          });
        }
      }
    );
  }
};

// 查询UN编号
const handleUnNumberLookup = async () => {
  try {
    // TODO: 调用 API 查询 UN 编号
    ElMessage.success('UN编号查询成功');
  } catch (error) {
    ElMessage.error('UN编号查询失败');
  }
};

// 验证FDA注册
const verifyFDARegistration = async () => {
  try {
    // TODO: 调用 API 验证 FDA 注册
    ElMessage.success('FDA注册验证成功');
  } catch (error) {
    ElMessage.error('FDA注册验证失败');
  }
};

// 查询FDA产品代码
const lookupProductCode = async () => {
  try {
    // TODO: 调用 API 查询 FDA 产品代码
    ElMessage.success('产品代码查询成功');
  } catch (error) {
    ElMessage.error('产品代码查询失败');
  }
};

// 刷新合规状态
const refreshComplianceStatus = async () => {
  try {
    // TODO: 调用 API 刷新合规状态
    ElMessage.success('合规状态刷新成功');
  } catch (error) {
    ElMessage.error('合规状态刷新失败');
  }
};

// 显示合规指南
const showComplianceGuide = () => {
  // TODO: 显示合规指南弹窗
  ElMessage.info('合规指南功能开发中');
};

// 添加认证
const handleAddCertification = () => {
  if (!form.certificationDetails) {
    form.certificationDetails = [];
  }
  form.certificationDetails.push({
    type: '',
    certificateNo: '',
    issueDate: '',
    expiryDate: '',
    issuingBody: '',
    status: 'pending',
    attachments: []
  });
};

// 删除认证
const handleRemoveCertification = (index: number) => {
  form.certificationDetails.splice(index, 1);
};

// 上传附件
const handleUploadAttachment = (index: number) => {
  // TODO: 实现附件上传功能
  ElMessage.info('附件上传功能开发中');
};

// 验证进口许可证
const verifyImportLicense = async () => {
  try {
    // TODO: 调用 API 验证进口许可证
    ElMessage.success('Import license verification successful');
  } catch (error) {
    ElMessage.error('Import license verification failed');
  }
};

// 验证出口许可证
const verifyExportLicense = async () => {
  try {
    // TODO: 调用 API 验证出口许可证
    ElMessage.success('Export license verification successful');
  } catch (error) {
    ElMessage.error('Export license verification failed');
  }
};

// 暴露验证方法给父组件
defineExpose({
  validate: () => formRef.value?.validate()
});
</script>

<style scoped>
.compliance-info {
  height: 100%;
  overflow-y: auto;
}

.compliance-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-card {
  :deep(.el-card__header) {
    padding: 12px 20px;
  }
}

.card-header {
  font-weight: 500;

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

:deep(.el-form-item) {
  margin-bottom: 18px;

  &:last-child {
    margin-bottom: 0;
  }
}

:deep(.el-tabs__content) {
  padding: 16px 0;
}

:deep(.el-radio-group) {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

:deep(.el-button-group) {
  display: flex;
  gap: 8px;
}

.table-footer {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.expiring {
  color: var(--el-color-warning);
}

:deep(.el-date-editor.el-input) {
  width: 100%;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-tooltip__trigger) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.certificate-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.certificate-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--el-bg-color);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  .certificate-name {
    font-size: 14px;
    color: var(--el-text-color-primary);
    font-weight: 500;
  }

  .certificate-upload {
    :deep(.el-upload) {
      margin-right: 0;
    }
  }
}
</style>
