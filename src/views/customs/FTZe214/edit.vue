<template>
  <div class="ftze214-edit-page">
    <div class="page-content">
      <div class="fixed-header">
        <div class="back-button" @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          <span>Back</span>
      </div>
        <div class="title">{{ pageTitle }}</div>
    </div>

      <div class="content-wrapper">
        <el-form 
          ref="formRef"
          :model="formData"
          :rules="!isViewMode ? formRules : {}"
          label-position="top"
          class="form-container"
          :disabled="isViewMode"
        >
          <!-- Zone Information -->
          <div class="form-section">
            <div class="section-title">ZONE INFORMATION</div>
            <div class="form-row">
              <el-form-item label="FTZ Number" prop="zoneInformation.ftzNumber" required>
                <el-input 
                  v-model="formData.zoneInformation.ftzNumber" 
                  placeholder="Enter FTZ Number (4-6 digits)"
                  maxlength="6"
                />
              </el-form-item>
              <el-form-item label="Site ID" prop="zoneInformation.siteId" required>
                <el-input 
                  v-model="formData.zoneInformation.siteId" 
                  placeholder="Enter Site ID"
                />
              </el-form-item>
              <el-form-item label="Port of Entry" prop="zoneInformation.portOfEntry" required>
                <div class="custom-select" v-click-outside="() => handleClickOutside('portOfEntry')">
                  <div class="select-trigger" :class="{ 'is-focus': showPortOfEntryDropdown }">
                    <input
                      v-model="portOfEntrySearch"
                      :placeholder="formData.zoneInformation.portOfEntry ? PORT_OF_ENTRY.find(p => p.value === formData.zoneInformation.portOfEntry)?.label : 'Select Port of Entry'"
                      @input="handleSearchInput('portOfEntry')"
                      @click.stop="toggleDropdown('portOfEntry')"
                      @focus="toggleDropdown('portOfEntry')"
                    />
                    <div class="select-icons">
                      <el-icon 
                        class="clear-icon" 
                        v-show="portOfEntrySearch || formData.zoneInformation.portOfEntry" 
                        @click.stop="clearSelect('portOfEntry')"
                      >
                        <CircleClose />
                      </el-icon>
                      <el-icon :class="{ 'is-reverse': showPortOfEntryDropdown }"><ArrowDown /></el-icon>
                    </div>
                  </div>
                  <div class="select-dropdown" v-show="showPortOfEntryDropdown" @click.stop>
                    <div 
                      v-for="port in filteredPortOfEntryOptions"
                      :key="port.value"
                      class="select-option" 
                      @click.stop="handleSelectOption('portOfEntry', port.value)"
                      :class="{ active: formData.zoneInformation.portOfEntry === port.value }"
                    >
                      {{ port.label }}
                    </div>
                  </div>
                </div>
              </el-form-item>
            </div>
          </div>

          <!-- Header Information -->
          <div class="form-section">
            <div class="section-title">HEADER INFORMATION</div>
            <!-- 操作类型和单号信息 -->
            <div class="form-row">
              <el-form-item label="Action Code" prop="headerInformation.actionCode" required>
                <div class="custom-select" v-click-outside="() => handleClickOutside('actionCode')">
                  <div class="select-trigger" :class="{ 'is-focus': showActionCodeDropdown }">
                    <input
                      v-model="actionCodeSearch"
                      :placeholder="formData.headerInformation.actionCode ? ACTION_CODES.find(a => a.value === formData.headerInformation.actionCode)?.label : 'Select Action Code'"
                      @input="handleSearchInput('actionCode')"
                      @click.stop="toggleDropdown('actionCode')"
                      @focus="toggleDropdown('actionCode')"
                    />
                    <div class="select-icons">
                      <el-icon 
                        class="clear-icon" 
                        v-show="actionCodeSearch || formData.headerInformation.actionCode" 
                        @click.stop="clearSelect('actionCode')"
                      >
                        <CircleClose />
                      </el-icon>
                      <el-icon :class="{ 'is-reverse': showActionCodeDropdown }"><ArrowDown /></el-icon>
                    </div>
                  </div>
                  <div class="select-dropdown" v-show="showActionCodeDropdown" @click.stop>
                    <div 
                      v-for="action in filteredActionCodes"
                      :key="action.value"
                      class="select-option" 
                      @click.stop="handleSelectOption('actionCode', action.value)"
                      :class="{ active: formData.headerInformation.actionCode === action.value }"
                    >
                      {{ action.label }}
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="Admission Number" prop="headerInformation.admissionNumber">
                <el-input 
                  v-model="formData.headerInformation.admissionNumber" 
                  placeholder="Will be assigned by CBP"
                  disabled
                />
              </el-form-item>
              <el-form-item label="Applicant Reference Number" prop="headerInformation.applicantReferenceNumber">
                <el-input 
                  v-model="formData.headerInformation.applicantReferenceNumber" 
                  placeholder="Enter Reference Number"
                />
              </el-form-item>
            </div>

            <!-- 关联信息 -->
            <template v-if="formData.headerInformation.actionCode !== 'A' || formData.headerInformation.admissionType === 'overage'">
              <div class="form-row">
                <el-form-item label="Reference Admission Number" prop="headerInformation.originalE214Number" required>
                  <el-input 
                    v-model="formData.headerInformation.originalE214Number" 
                    placeholder="Enter Reference Admission Number"
                  />
                </el-form-item>
                <el-form-item 
                  v-if="formData.headerInformation.actionCode !== 'A'"
                  label="Reason for Action" 
                  prop="headerInformation.reasonForAction" 
                  required
                >
                  <el-input 
                    v-model="formData.headerInformation.reasonForAction" 
                    type="textarea"
                    :rows="1"
                    placeholder="Enter reason for change/replace/delete"
                  />
                </el-form-item>
              </div>
            </template>

            <!-- 入境类型和日期信息 -->
            <div class="form-row">
              <el-form-item 
                v-if="!isDeleteMode"
                label="Admission Type" 
                prop="headerInformation.admissionType" 
                required
              >
                <div class="custom-select" v-click-outside="() => handleClickOutside('admissionType')">
                  <div class="select-trigger" :class="{ 'is-focus': showAdmissionTypeDropdown }">
                    <input
                      v-model="admissionTypeSearch"
                      :placeholder="formData.headerInformation.admissionType ? ADMISSION_TYPES.find(t => t.value === formData.headerInformation.admissionType)?.label : 'Select Admission Type'"
                      @input="handleSearchInput('admissionType')"
                      @click.stop="toggleDropdown('admissionType')"
                      @focus="toggleDropdown('admissionType')"
                    />
                    <div class="select-icons">
                      <el-icon 
                        class="clear-icon" 
                        v-show="admissionTypeSearch || formData.headerInformation.admissionType" 
                        @click.stop="clearSelect('admissionType')"
                      >
                        <CircleClose />
                      </el-icon>
                      <el-icon :class="{ 'is-reverse': showAdmissionTypeDropdown }"><ArrowDown /></el-icon>
                    </div>
                  </div>
                  <div class="select-dropdown" v-show="showAdmissionTypeDropdown" @click.stop>
                    <div 
                      v-for="type in filteredAdmissionTypes"
                      :key="type.value"
                      class="select-option" 
                      @click.stop="handleSelectOption('admissionType', type.value)"
                      :class="{ active: formData.headerInformation.admissionType === type.value }"
                    >
                      {{ type.label }}
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="Entry Type" prop="headerInformation.entryType" required>
                <div class="custom-select" v-click-outside="() => handleClickOutside('entryType')">
                  <div class="select-trigger" :class="{ 'is-focus': showEntryTypeDropdown }">
                    <input
                      v-model="entryTypeSearch"
                      :placeholder="formData.headerInformation.entryType ? ENTRY_TYPES.find(t => t.value === formData.headerInformation.entryType)?.label : 'Select Entry Type'"
                      @input="handleSearchInput('entryType')"
                      @click.stop="toggleDropdown('entryType')"
                      @focus="toggleDropdown('entryType')"
                    />
                    <div class="select-icons">
                      <el-icon 
                        class="clear-icon" 
                        v-show="entryTypeSearch || formData.headerInformation.entryType" 
                        @click.stop="clearSelect('entryType')"
                      >
                        <CircleClose />
                      </el-icon>
                      <el-icon :class="{ 'is-reverse': showEntryTypeDropdown }"><ArrowDown /></el-icon>
                    </div>
                  </div>
                  <div class="select-dropdown" v-show="showEntryTypeDropdown" @click.stop>
                    <div 
                      v-for="type in filteredEntryTypes"
                      :key="type.value"
                      class="select-option" 
                      @click.stop="handleSelectOption('entryType', type.value)"
                      :class="{ active: formData.headerInformation.entryType === type.value }"
                    >
                      {{ type.label }}
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="Estimated Entry Date" prop="headerInformation.estimatedEntryDate" required>
                <el-date-picker
                  v-model="formData.headerInformation.estimatedEntryDate"
                  type="date"
                  placeholder="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                />
              </el-form-item>
            </div>

            <!-- 特殊类型相关字段 -->
            <div class="form-row">
              <el-form-item label="In-Bond Number" 
                prop="headerInformation.inBondNumber"
                :required="['regular', 'zone_to_zone', 'temporary'].includes(formData.headerInformation.admissionType)"
              >
                <el-input 
                  v-model="formData.headerInformation.inBondNumber" 
                  placeholder="Enter In-Bond Number"
                />
              </el-form-item>
              <el-form-item 
                v-if="formData.headerInformation.admissionType === 'zone_to_zone'"
                label="Target FTZ Number" 
                prop="headerInformation.targetFtzNumber" 
                required
              >
                <el-input 
                  v-model="formData.headerInformation.targetFtzNumber" 
                  placeholder="Enter Target FTZ Number (4-6 digits)"
                  maxlength="6"
                />
              </el-form-item>
              <el-form-item 
                v-if="formData.headerInformation.admissionType === 'temporary'"
                label="Estimated Clearance Date" 
                prop="headerInformation.clearanceDate" 
                required
              >
                <el-date-picker
                  v-model="formData.headerInformation.clearanceDate"
                  type="date"
                  placeholder="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                />
              </el-form-item>
            </div>

            <!-- 其他基本信息 -->
            <div class="form-row">
              <el-form-item label="Direct Delivery Indicator" prop="headerInformation.directDeliveryIndicator" required>
                <div class="custom-select" v-click-outside="() => handleClickOutside('directDelivery')">
                  <div class="select-trigger" :class="{ 'is-focus': showDirectDeliveryDropdown }">
                    <input
                      v-model="directDeliverySearch"
                      :placeholder="formData.headerInformation.directDeliveryIndicator ? DIRECT_DELIVERY_OPTIONS.find(d => d.value === formData.headerInformation.directDeliveryIndicator)?.label || 'Select Direct Delivery Indicator' : 'Select Direct Delivery Indicator'"
                      @input="handleSearchInput('directDelivery')"
                      @click.stop="toggleDropdown('directDelivery')"
                      @focus="toggleDropdown('directDelivery')"
                    />
                    <div class="select-icons">
                      <el-icon 
                        class="clear-icon" 
                        v-show="directDeliverySearch || formData.headerInformation.directDeliveryIndicator" 
                        @click.stop="clearSelect('directDelivery')"
                      >
                        <CircleClose />
                      </el-icon>
                      <el-icon :class="{ 'is-reverse': showDirectDeliveryDropdown }"><ArrowDown /></el-icon>
                    </div>
                  </div>
                  <div class="select-dropdown" v-show="showDirectDeliveryDropdown" @click.stop>
                    <div 
                      v-for="option in filteredDirectDeliveryOptions"
                      :key="option.value"
                      class="select-option" 
                      @click.stop="handleSelectOption('directDelivery', option.value)"
                      :class="{ active: formData.headerInformation.directDeliveryIndicator === option.value }"
                    >
                      {{ option.label }}
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="FIRMS Code" prop="headerInformation.firmsCode" required>
                <el-input 
                  v-model="formData.headerInformation.firmsCode" 
                  placeholder="Enter FIRMS Code"
                  maxlength="4"
                />
              </el-form-item>
            </div>
          </div>

          <!-- Party Information -->
          <div v-if="!isDeleteMode" class="form-section">
            <div class="section-title">PARTY INFORMATION</div>
            <div class="form-row">
              <el-form-item label="Operator ID" prop="partyInformation.operatorId" required>
                <el-input 
                  v-model="formData.partyInformation.operatorId" 
                  placeholder="Enter Operator ID"
                />
              </el-form-item>
              <el-form-item label="Operator Name" prop="partyInformation.operatorName" required>
                <el-input 
                  v-model="formData.partyInformation.operatorName" 
                  placeholder="Enter Operator Name"
                />
              </el-form-item>
              <el-form-item label="Operator Address" prop="partyInformation.operatorAddress" required>
                <el-input 
                  v-model="formData.partyInformation.operatorAddress" 
                  placeholder="Enter Operator Address"
                />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="Importer Name" prop="partyInformation.importerName" required>
                <el-input 
                  v-model="formData.partyInformation.importerName" 
                  placeholder="Enter Importer Name"
                />
              </el-form-item>
              <el-form-item label="Importer Tax ID" prop="partyInformation.importerTaxId" required>
                <el-input 
                  v-model="formData.partyInformation.importerTaxId" 
                  placeholder="12-345678900"
                />
              </el-form-item>
              <el-form-item label="Importer Address" prop="partyInformation.importerAddress" required>
                <el-input 
                  v-model="formData.partyInformation.importerAddress" 
                  placeholder="Enter Importer Address"
                />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="Broker ID" prop="partyInformation.brokerId">
                <el-input 
                  v-model="formData.partyInformation.brokerId" 
                  placeholder="Enter Broker ID"
                />
              </el-form-item>
              <el-form-item label="Broker Name" prop="partyInformation.brokerName">
                <el-input 
                  v-model="formData.partyInformation.brokerName" 
                  placeholder="Enter Broker Name"
                />
              </el-form-item>
              <el-form-item label="Broker Address" prop="partyInformation.brokerAddress">
                <el-input 
                  v-model="formData.partyInformation.brokerAddress" 
                  placeholder="Enter Broker Address"
                />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="Contact Name" prop="partyInformation.contactName" required>
                <el-input 
                  v-model="formData.partyInformation.contactName" 
                  placeholder="Enter Contact Name"
                />
              </el-form-item>
              <el-form-item label="Contact Email" prop="partyInformation.contactEmail" required>
                <el-input 
                  v-model="formData.partyInformation.contactEmail" 
                  placeholder="Enter Contact Email"
                />
              </el-form-item>
              <el-form-item label="Contact Phone" prop="partyInformation.contactPhone" required>
                <el-input 
                  v-model="formData.partyInformation.contactPhone" 
                  placeholder="+1-XXX-XXX-XXXX"
                />
              </el-form-item>
            </div>
          </div>

          <!-- Transportation Information -->
          <div v-if="!isDeleteMode" class="form-section">
            <div class="section-title">TRANSPORTATION INFORMATION</div>
            <div class="form-row">
              <el-form-item label="Arrival Date" prop="transportationInformation.arrivalDate" required>
                <el-date-picker
                  v-model="formData.transportationInformation.arrivalDate"
                  type="date"
                  placeholder="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                />
              </el-form-item>
              <el-form-item label="Export Date" prop="transportationInformation.exportDate" required>
                <el-date-picker
                  v-model="formData.transportationInformation.exportDate"
                  type="date"
                  placeholder="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                />
              </el-form-item>
              <el-form-item label="Conveyance ID" prop="transportationInformation.conveyanceId" required>
                <el-input 
                  v-model="formData.transportationInformation.conveyanceId" 
                  placeholder="Enter Vessel/Flight/Truck ID"
                />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="SCAC/Airway Bill Prefix" prop="transportationInformation.scacCode" required>
                <el-input 
                  v-model="formData.transportationInformation.scacCode" 
                  placeholder="Enter SCAC Code"
                  maxlength="4"
                />
              </el-form-item>
              <el-form-item label="Vessel Name" prop="transportationInformation.vesselName">
                <el-input 
                  v-model="formData.transportationInformation.vesselName" 
                  placeholder="Enter Vessel Name"
                />
              </el-form-item>
              <el-form-item label="Voyage/Flight/Trip" prop="transportationInformation.voyageFlightTrip" required>
                <el-input 
                  v-model="formData.transportationInformation.voyageFlightTrip" 
                  placeholder="Enter Voyage/Flight/Trip Number"
                />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="Loading Port Code" prop="transportationInformation.loadingPortCode" required>
                <el-input 
                  v-model="formData.transportationInformation.loadingPortCode" 
                  placeholder="Enter Loading Port Code"
                />
              </el-form-item>
              <el-form-item label="Foreign Port of Lading" prop="transportationInformation.foreignPortOfLading" required>
                <el-input 
                  v-model="formData.transportationInformation.foreignPortOfLading" 
                  placeholder="Enter Foreign Port of Lading"
                />
              </el-form-item>
              <el-form-item label="Manifest Quantity" prop="transportationInformation.manifestQuantity" required>
                <el-input-number 
                  v-model="formData.transportationInformation.manifestQuantity" 
                  :min="0"
                  controls-position="right"
                  placeholder="Enter Quantity"
                />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="Mode of Transport" prop="transportationInformation.modeOfTransport" required>
                <div class="custom-select" v-click-outside="() => handleClickOutside('modeOfTransport')">
                  <div class="select-trigger" :class="{ 'is-focus': showModeOfTransportDropdown }">
                    <input
                      v-model="modeOfTransportSearch"
                      :placeholder="formData.transportationInformation.modeOfTransport ? TRANSPORT_MODES.find(m => m.value === formData.transportationInformation.modeOfTransport)?.label || 'Select Mode of Transport' : 'Select Mode of Transport'"
                      @input="handleSearchInput('modeOfTransport')"
                      @click.stop="toggleDropdown('modeOfTransport')"
                      @focus="toggleDropdown('modeOfTransport')"
                    />
                    <div class="select-icons">
                      <el-icon 
                        class="clear-icon" 
                        v-show="modeOfTransportSearch || formData.transportationInformation.modeOfTransport" 
                        @click.stop="clearSelect('modeOfTransport')"
                      >
                        <CircleClose />
                      </el-icon>
                      <el-icon :class="{ 'is-reverse': showModeOfTransportDropdown }"><ArrowDown /></el-icon>
                    </div>
                  </div>
                  <div class="select-dropdown" v-show="showModeOfTransportDropdown" @click.stop>
                    <div 
                      v-for="mode in filteredTransportModes"
                      :key="mode.value"
                      class="select-option" 
                      @click.stop="handleSelectOption('modeOfTransport', mode.value)"
                      :class="{ active: formData.transportationInformation.modeOfTransport === mode.value }"
                    >
                      {{ mode.label }}
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="Container Number" prop="transportationInformation.containerNumber">
                <el-input 
                  v-model="formData.transportationInformation.containerNumber" 
                  placeholder="Enter Container Number"
                />
              </el-form-item>
            </div>
          </div>

          <!-- Bill of Lading -->
          <div v-if="!isDeleteMode" class="form-section">
            <div class="section-title">BILL OF LADING</div>
            <div class="form-row">
              <el-form-item label="Master Bill Number" prop="billOfLading.masterBillNumber" required>
                <el-input 
                  v-model="formData.billOfLading.masterBillNumber" 
                  placeholder="Enter Master Bill Number"
                />
              </el-form-item>
              <el-form-item label="House Bill Number" prop="billOfLading.houseBillNumber">
                <el-input 
                  v-model="formData.billOfLading.houseBillNumber" 
                  placeholder="Enter House Bill Number"
                />
              </el-form-item>
              <el-form-item label="Quantity" prop="billOfLading.quantity" required>
                <el-input-number 
                  v-model="formData.billOfLading.quantity" 
                  :min="0"
                  controls-position="right"
                  placeholder="Enter Quantity"
                />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="Unit of Measure" prop="billOfLading.uom" required>
                <div class="custom-select" v-click-outside="() => handleClickOutside('uom')">
                  <div class="select-trigger" :class="{ 'is-focus': showUomDropdown }">
                    <input
                      v-model="uomSearch"
                      :placeholder="formData.billOfLading.uom ? UNITS_OF_MEASURE.find(u => u.value === formData.billOfLading.uom)?.label || 'Select Unit of Measure' : 'Select Unit of Measure'"
                      @input="handleSearchInput('uom')"
                      @click.stop="toggleDropdown('uom')"
                      @focus="toggleDropdown('uom')"
                    />
                    <div class="select-icons">
                      <el-icon 
                        class="clear-icon" 
                        v-show="uomSearch || formData.billOfLading.uom" 
                        @click.stop="clearSelect('uom')"
                      >
                        <CircleClose />
                      </el-icon>
                      <el-icon :class="{ 'is-reverse': showUomDropdown }"><ArrowDown /></el-icon>
                    </div>
                  </div>
                  <div class="select-dropdown" v-show="showUomDropdown" @click.stop>
                    <div 
                      v-for="unit in filteredUnitOfMeasure"
                      :key="unit.value"
                      class="select-option" 
                      @click.stop="handleSelectOption('uom', unit.value)"
                      :class="{ active: formData.billOfLading.uom === unit.value }"
                    >
                      {{ unit.label }}
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="Foreign Load Port" prop="billOfLading.foreignLoadPort" required>
                <el-input 
                  v-model="formData.billOfLading.foreignLoadPort" 
                  placeholder="Enter Foreign Load Port"
                />
              </el-form-item>
              <el-form-item label="Country of Export" prop="billOfLading.countryOfExport" required>
                <el-input 
                  v-model="formData.billOfLading.countryOfExport" 
                  placeholder="Enter Country Code"
                  maxlength="2"
                />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="Container Number" prop="billOfLading.containerNumber">
                <el-input 
                  v-model="formData.billOfLading.containerNumber" 
                  placeholder="Enter Container Number"
                />
              </el-form-item>
              <el-form-item label="Total Gross Weight (KG)" prop="billOfLading.totalGrossWeight" required>
                <el-input-number 
                  v-model="formData.billOfLading.totalGrossWeight" 
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  placeholder="Enter Weight"
                />
              </el-form-item>
            </div>
          </div>

          <!-- Line Items -->
          <div v-if="!isDeleteMode" class="form-section">
            <div class="section-header">
              <div class="section-title">LINE ITEMS</div>
              <el-button 
                v-if="!isViewMode"
                type="primary" 
                class="add-line-btn" 
                @click="addLineItem"
              >Add Line Item</el-button>
            </div>
            <div class="line-items-container">
              <div v-for="(item, index) in formData.lineItems" :key="index" class="line-item">
                <div class="line-item-header">
                  <span class="line-item-title">Line Item {{ index + 1 }}</span>
                  <el-button 
                    v-if="!isViewMode"
                    type="danger" 
                    link
                    @click="removeLineItem(index)"
                  >Remove</el-button>
                </div>
                <div class="line-item-content">
                  <div class="line-item-row">
                    <el-form-item 
                      :prop="'lineItems.' + index + '.usePartsInventory'"
                      class="checkbox-item"
                    >
                      <el-checkbox v-model="item.usePartsInventory">Use Parts Inventory</el-checkbox>
                    </el-form-item>
                    <el-form-item 
                      v-if="item.usePartsInventory"
                      :prop="'lineItems.' + index + '.partNumber'"
                      label="Part Number"
                      required
                    >
                      <el-input v-model="item.partNumber" placeholder="Enter Part Number" />
                    </el-form-item>
                  </div>
                  <div class="line-item-row">
                    <el-form-item 
                      :prop="'lineItems.' + index + '.htsCode'"
                      label="HTS Code"
                      required
                    >
                      <el-input v-model="item.htsCode" placeholder="Enter HTS Code (10 digits)" />
                    </el-form-item>
                    <el-form-item 
                      :prop="'lineItems.' + index + '.qty'"
                      label="QTY"
                      required
                    >
                      <el-input-number 
                        v-model="item.qty" 
                        :min="0" 
                        :precision="2" 
                        controls-position="right" 
                      />
                    </el-form-item>
                    <el-form-item 
                      :prop="'lineItems.' + index + '.weight'"
                      label="Weight (KG)"
                      required
                    >
                      <el-input-number 
                        v-model="item.weight" 
                        :min="0" 
                        :precision="2" 
                        controls-position="right" 
                      />
                    </el-form-item>
                  </div>
                  <div class="line-item-row">
                    <el-form-item 
                      :prop="'lineItems.' + index + '.pieceCount'"
                      label="Piece Count"
                      required
                    >
                      <el-input-number v-model="item.pieceCount" :min="0" controls-position="right" />
                    </el-form-item>
                    <el-form-item 
                      :prop="'lineItems.' + index + '.value'"
                      label="Value (USD)"
                      required
                    >
                      <el-input-number 
                        v-model="item.value" 
                        :min="0" 
                        :precision="2" 
                        controls-position="right" 
                      />
                    </el-form-item>
                    <el-form-item 
                      :prop="'lineItems.' + index + '.charges'"
                      label="Charges"
                    >
                      <el-input-number 
                        v-model="item.charges" 
                        :min="0" 
                        :precision="2" 
                        controls-position="right" 
                      />
                    </el-form-item>
                  </div>
                  <div class="line-item-row">
                    <el-form-item 
                      :prop="'lineItems.' + index + '.midReference'"
                      label="MID Reference"
                    >
                      <el-input v-model="item.midReference" placeholder="Enter MID Reference" />
                    </el-form-item>
                    <el-form-item 
                      :prop="'lineItems.' + index + '.assignedContainer'"
                      label="Assigned Container"
                    >
                      <el-input v-model="item.assignedContainer" placeholder="Enter Container Number" />
                    </el-form-item>
                    <el-form-item 
                      :prop="'lineItems.' + index + '.countryOfOrigin'"
                      label="Country of Origin"
                      required
                    >
                      <el-input 
                        v-model="item.countryOfOrigin" 
                        placeholder="Enter Country Code"
                        maxlength="2"
                      />
                    </el-form-item>
                  </div>
                  <div class="line-item-row">
                    <el-form-item 
                      :prop="'lineItems.' + index + '.lotNumber'"
                      label="Lot Number"
                    >
                      <el-input v-model="item.lotNumber" placeholder="Enter Lot Number" />
                    </el-form-item>
                    <el-form-item 
                      :prop="'lineItems.' + index + '.description'"
                      label="Description of Merchandise"
                      required
                      class="description-field"
                    >
                      <el-input 
                        v-model="item.description" 
                        type="textarea" 
                        :rows="2"
                        placeholder="Enter detailed description" 
                      />
                    </el-form-item>
                    <el-form-item 
                      :prop="'lineItems.' + index + '.remarks'"
                      label="Remarks"
                    >
                      <el-input 
                        v-model="item.remarks" 
                        type="textarea"
                        :rows="2"
                        placeholder="Enter Remarks" 
                      />
                    </el-form-item>
                  </div>
                  <div class="line-item-row">
                    <el-form-item 
                      :prop="'lineItems.' + index + '.zoneStatus'"
                      label="Zone Status"
                      required
                    >
                      <div class="custom-select" v-click-outside="() => handleClickOutside('zoneStatus')">
                        <div class="select-trigger" :class="{ 'is-focus': showZoneStatusDropdown }">
                          <input
                            v-model="zoneStatusSearch"
                            :placeholder="item.zoneStatus ? ZONE_STATUSES.find(s => s.value === item.zoneStatus)?.label || 'Select Zone Status' : 'Select Zone Status'"
                            @input="handleSearchInput('zoneStatus')"
                            @click.stop="toggleDropdown('zoneStatus')"
                            @focus="toggleDropdown('zoneStatus')"
                          />
                          <div class="select-icons">
                            <el-icon 
                              class="clear-icon" 
                              v-show="zoneStatusSearch || item.zoneStatus" 
                              @click.stop="clearSelect('zoneStatus')"
                            >
                              <CircleClose />
                            </el-icon>
                            <el-icon :class="{ 'is-reverse': showZoneStatusDropdown }"><ArrowDown /></el-icon>
                          </div>
                        </div>
                        <div class="select-dropdown" v-show="showZoneStatusDropdown" @click.stop>
                          <div 
                            v-for="status in filteredZoneStatuses"
                            :key="status.value"
                            class="select-option" 
                            @click.stop="handleSelectOption('zoneStatus', status.value)"
                            :class="{ active: item.zoneStatus === status.value }"
                          >
                            {{ status.label }}
                          </div>
                        </div>
                      </div>
                    </el-form-item>
                    <el-form-item 
                      :prop="'lineItems.' + index + '.pnDisclaimer'"
                      class="checkbox-item"
                    >
                      <el-checkbox v-model="item.pnDisclaimer">PN Disclaimer</el-checkbox>
                    </el-form-item>
                    <el-form-item 
                      v-if="item.pnDisclaimer"
                      :prop="'lineItems.' + index + '.priorNoticeNumber'"
                      label="Prior Notice Number"
                      required
                    >
                      <el-input v-model="item.priorNoticeNumber" placeholder="Enter Prior Notice Number" />
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div v-if="!isViewMode" class="form-actions">
            <el-button @click="handleCancel">Cancel</el-button>
            <el-button type="primary" @click="handleSubmit">Submit</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { ArrowLeft, CircleClose, ArrowDown } from '@element-plus/icons-vue'
import { 
  ACTION_CODES, 
  ADMISSION_TYPES, 
  ENTRY_TYPES,
  PORT_OF_ENTRY,
  TRANSPORT_MODES,
  UNITS_OF_MEASURE,
  ZONE_STATUSES,
  DIRECT_DELIVERY_OPTIONS,
  type Option,
  type FTZe214FormData,
  type LineItem,
  type DirectDeliveryIndicator,
  type AdmissionType,
  type EntryType,
  type TransportMode,
  type UnitOfMeasure,
  type ZoneStatus,
  type ActionCode
} from './types'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()

// 根据路由名称判断当前模式
const isCreateMode = route.name === 'CreateFTZe214'
const isEditMode = route.name === 'EditFTZe214'
const isViewMode = route.name === 'ViewFTZe214'

// 设置页面标题
const pageTitle = computed(() => {
  switch (route.name) {
    case 'CreateFTZe214':
      return 'Create FTZ e-214'
    case 'EditFTZe214':
      return 'Edit FTZ e-214'
    case 'ViewFTZe214':
      return 'View FTZ e-214'
    default:
      return 'FTZ e-214'
  }
})

// 表单数据
const formData = ref<FTZe214FormData>({
  zoneInformation: {
    ftzNumber: '',
    siteId: '',
    portOfEntry: ''
  },
  headerInformation: {
    actionCode: 'A',
    admissionType: '',
    admissionNumber: '',
    estimatedEntryDate: '',
    applicantReferenceNumber: '',
    inBondNumber: '',
    directDeliveryIndicator: '',
    entryType: '',
    controlNumber: '',
    firmsCode: '',
    reasonForAction: '',
    originalE214Number: '',
    targetFtzNumber: '',  // 添加目标 FTZ 编号字段
    clearanceDate: ''     // 添加预计清关日期字段
  },
  partyInformation: {
    operatorId: '',
    operatorName: '',
    operatorAddress: '',
    importerName: '',
    importerTaxId: '',
    importerAddress: '',
    brokerId: '',
    brokerName: '',
    brokerAddress: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  },
  transportationInformation: {
    arrivalDate: '',
    exportDate: '',
    conveyanceId: '',
    scacCode: '',
    vesselName: '',
    voyageFlightTrip: '',
    loadingPortCode: '',
    foreignPortOfLading: '',
    manifestQuantity: 0,
    modeOfTransport: '',
    containerNumber: ''
  },
  billOfLading: {
    masterBillNumber: '',
    houseBillNumber: '',
    quantity: 0,
    uom: '',
    foreignLoadPort: '',
    countryOfExport: '',
    containerNumber: '',
    totalGrossWeight: 0
  },
  lineItems: []
})

// 表单验证规则
const formRules = computed(() => {
  const baseRules = {
    'zoneInformation.ftzNumber': [
      { required: true, message: 'FTZ Number is required', trigger: 'blur' },
      { pattern: /^\d{4,6}$/, message: 'FTZ Number must be 4-6 digits', trigger: 'blur' }
    ],
    'zoneInformation.siteId': [
      { required: true, message: 'Site ID is required', trigger: 'blur' }
    ],
    'zoneInformation.portOfEntry': [
      { required: true, message: 'Port of Entry is required', trigger: 'change' }
    ],
    'headerInformation.actionCode': [
      { required: true, message: 'Action Code is required', trigger: 'change' }
    ],
    'headerInformation.admissionNumber': [
      { pattern: /^214-\d{4}-\d{6}$/, message: 'Invalid Admission Number format (214-YYYY-000123)', trigger: 'blur' }
    ],
    'headerInformation.inBondNumber': [
      { 
        required: true, 
        message: 'In-Bond Number is required', 
        trigger: 'blur',
        validator: (rule: any, value: string, callback: Function) => {
          const requiredTypes = ['regular', 'zone_to_zone', 'temporary']
          if (requiredTypes.includes(formData.value.headerInformation.admissionType) && !value) {
            callback(new Error('In-Bond Number is required for Regular Admission, Zone to Zone, and Temporary Deposit'))
          } else {
            callback()
          }
        }
      }
    ]
  }

  // 如果是删除操作，只返回基本验证规则
  if (formData.value.headerInformation.actionCode === 'D') {
    return baseRules
  }

  // 非删除操作，返回完整验证规则
  return {
    ...baseRules,
    'headerInformation.admissionType': [
      { required: true, message: 'Admission Type is required', trigger: 'change' }
    ],
    'headerInformation.estimatedEntryDate': [
      { required: true, message: 'Estimated Entry Date is required', trigger: 'change' }
    ],
    'headerInformation.directDeliveryIndicator': [
      { required: true, message: 'Direct Delivery Indicator is required', trigger: 'change' }
    ],
    'headerInformation.entryType': [
      { required: true, message: 'Entry Type is required', trigger: 'change' }
    ],
    'headerInformation.firmsCode': [
      { required: true, message: 'FIRMS Code is required', trigger: 'blur' },
      { pattern: /^[A-Z0-9]{4}$/, message: 'FIRMS Code must be 4 characters', trigger: 'blur' }
    ],
    'headerInformation.reasonForAction': [
      { 
        required: true, 
        message: 'Reason for Action is required', 
        trigger: 'blur',
        validator: (rule: any, value: string, callback: Function) => {
          if (formData.value.headerInformation.actionCode !== 'A' && !value) {
            callback(new Error('Reason for Action is required for Change/Replace/Delete'))
          } else {
            callback()
          }
        }
      }
    ],
    'headerInformation.originalE214Number': [
      { 
        required: true, 
        message: 'Reference Admission Number is required', 
        trigger: 'blur',
        validator: (rule: any, value: string, callback: Function) => {
          if ((formData.value.headerInformation.actionCode !== 'A' || formData.value.headerInformation.admissionType === 'overage') && !value) {
            callback(new Error('Reference Admission Number is required for Change/Replace/Delete/Overage'))
          } else {
            callback()
          }
        }
      }
    ],
    'partyInformation.operatorId': [
      { required: true, message: 'Operator ID is required', trigger: 'blur' }
    ],
    'partyInformation.operatorName': [
      { required: true, message: 'Operator Name is required', trigger: 'blur' }
    ],
    'partyInformation.operatorAddress': [
      { required: true, message: 'Operator Address is required', trigger: 'blur' }
    ],
    'partyInformation.importerName': [
      { required: true, message: 'Importer Name is required', trigger: 'blur' }
    ],
    'partyInformation.importerTaxId': [
      { required: true, message: 'Importer Tax ID is required', trigger: 'blur' },
      { pattern: /^\d{2}-\d{9}$/, message: 'Invalid Tax ID format (12-345678900)', trigger: 'blur' }
    ],
    'partyInformation.importerAddress': [
      { required: true, message: 'Importer Address is required', trigger: 'blur' }
    ],
    'partyInformation.contactName': [
      { required: true, message: 'Contact Name is required', trigger: 'blur' }
    ],
    'partyInformation.contactEmail': [
      { required: true, message: 'Contact Email is required', trigger: 'blur' },
      { type: 'email', message: 'Invalid email format', trigger: 'blur' }
    ],
    'partyInformation.contactPhone': [
      { required: true, message: 'Contact Phone is required', trigger: 'blur' },
      { pattern: /^\+1-\d{3}-\d{3}-\d{4}$/, message: 'Invalid phone format (+1-XXX-XXX-XXXX)', trigger: 'blur' }
    ],
    'transportationInformation.arrivalDate': [
      { required: true, message: 'Arrival Date is required', trigger: 'change' }
    ],
    'transportationInformation.exportDate': [
      { required: true, message: 'Export Date is required', trigger: 'change' }
    ],
    'transportationInformation.conveyanceId': [
      { required: true, message: 'Conveyance ID is required', trigger: 'blur' }
    ],
    'transportationInformation.scacCode': [
      { required: true, message: 'SCAC Code is required', trigger: 'blur' },
      { pattern: /^[A-Z]{4}$/, message: 'SCAC Code must be 4 uppercase letters', trigger: 'blur' }
    ],
    'transportationInformation.voyageFlightTrip': [
      { required: true, message: 'Voyage/Flight/Trip Number is required', trigger: 'blur' }
    ],
    'transportationInformation.loadingPortCode': [
      { required: true, message: 'Loading Port Code is required', trigger: 'blur' }
    ],
    'transportationInformation.foreignPortOfLading': [
      { required: true, message: 'Foreign Port of Lading is required', trigger: 'blur' }
    ],
    'transportationInformation.manifestQuantity': [
      { required: true, message: 'Manifest Quantity is required', trigger: 'change' },
      { type: 'number', min: 0, message: 'Manifest Quantity must be greater than 0', trigger: 'change' }
    ],
    'transportationInformation.modeOfTransport': [
      { required: true, message: 'Mode of Transport is required', trigger: 'change' }
    ],
    'billOfLading.masterBillNumber': [
      { required: true, message: 'Master Bill Number is required', trigger: 'blur' }
    ],
    'billOfLading.quantity': [
      { required: true, message: 'Quantity is required', trigger: 'change' },
      { type: 'number', min: 0, message: 'Quantity must be greater than 0', trigger: 'change' }
    ],
    'billOfLading.uom': [
      { required: true, message: 'Unit of Measure is required', trigger: 'change' }
    ],
    'billOfLading.foreignLoadPort': [
      { required: true, message: 'Foreign Load Port is required', trigger: 'blur' }
    ],
    'billOfLading.countryOfExport': [
      { required: true, message: 'Country of Export is required', trigger: 'blur' },
      { pattern: /^[A-Z]{2}$/, message: 'Country Code must be 2 uppercase letters', trigger: 'blur' }
    ],
    'billOfLading.totalGrossWeight': [
      { required: true, message: 'Total Gross Weight is required', trigger: 'change' },
      { type: 'number', min: 0, message: 'Total Gross Weight must be greater than 0', trigger: 'change' }
    ],
    'headerInformation.targetFtzNumber': [
      { 
        required: true, 
        message: 'Target FTZ Number is required', 
        trigger: 'blur',
        validator: (rule: any, value: string, callback: Function) => {
          if (formData.value.headerInformation.admissionType === 'zone_to_zone' && !value) {
            callback(new Error('Target FTZ Number is required for Zone to Zone transfer'))
          } else {
            callback()
          }
        }
      },
      { pattern: /^\d{4,6}$/, message: 'Target FTZ Number must be 4-6 digits', trigger: 'blur' }
    ],
    'headerInformation.clearanceDate': [
      { 
        required: true, 
        message: 'Estimated Clearance Date is required', 
        trigger: 'change',
        validator: (rule: any, value: string, callback: Function) => {
          if (formData.value.headerInformation.admissionType === 'temporary') {
            if (!value) {
              callback(new Error('Estimated Clearance Date is required for Temporary Deposit'))
            } else {
              const clearanceDate = new Date(value)
              const today = new Date()
              const maxDate = new Date(today.setMonth(today.getMonth() + 12))
              if (clearanceDate > maxDate) {
                callback(new Error('Clearance Date cannot exceed 12 months from today'))
              } else {
                callback()
              }
            }
          } else {
            callback()
          }
        }
      }
    ]
  }
})

// 添加搜索状态
const portOfEntrySearch = ref('')
const admissionTypeSearch = ref('')
const entryTypeSearch = ref('')
const modeOfTransportSearch = ref('')
const uomSearch = ref('')
const zoneStatusSearch = ref('')
const actionCodeSearch = ref('')
const directDeliverySearch = ref('')

// 添加下拉框显示状态
const showPortOfEntryDropdown = ref(false)
const showAdmissionTypeDropdown = ref(false)
const showEntryTypeDropdown = ref(false)
const showModeOfTransportDropdown = ref(false)
const showUomDropdown = ref(false)
const showZoneStatusDropdown = ref(false)
const showActionCodeDropdown = ref(false)
const showDirectDeliveryDropdown = ref(false)

// 过滤选项
const filteredPortOfEntryOptions = computed(() => {
  return PORT_OF_ENTRY.filter((port) =>
    port.label.toLowerCase().includes(portOfEntrySearch.value.toLowerCase())
  )
})

const filteredAdmissionTypes = computed(() => {
  return ADMISSION_TYPES.filter((type) =>
    type.label.toLowerCase().includes(admissionTypeSearch.value.toLowerCase())
  )
})

const filteredEntryTypes = computed(() => {
  return ENTRY_TYPES.filter((type) =>
    type.label.toLowerCase().includes(entryTypeSearch.value.toLowerCase())
  )
})

const filteredTransportModes = computed(() => {
  return TRANSPORT_MODES.filter((mode) =>
    mode.label.toLowerCase().includes(modeOfTransportSearch.value.toLowerCase())
  )
})

const filteredUnitOfMeasure = computed(() => {
  return UNITS_OF_MEASURE.filter((unit) =>
    unit.label.toLowerCase().includes(uomSearch.value.toLowerCase())
  )
})

const filteredZoneStatuses = computed(() => {
  return ZONE_STATUSES.filter((status) =>
    status.label.toLowerCase().includes(zoneStatusSearch.value.toLowerCase())
  )
})

const filteredActionCodes = computed(() => {
  return ACTION_CODES.filter((action) =>
    action.label.toLowerCase().includes(actionCodeSearch.value.toLowerCase())
  )
})

const filteredDirectDeliveryOptions = computed(() => {
  return DIRECT_DELIVERY_OPTIONS.filter((option) =>
    option.label.toLowerCase().includes(directDeliverySearch.value.toLowerCase())
  )
})

// 处理下拉框事件
const handleClickOutside = (type: string) => {
  switch (type) {
    case 'portOfEntry':
      showPortOfEntryDropdown.value = false
      break
    case 'admissionType':
      showAdmissionTypeDropdown.value = false
      break
    case 'entryType':
      showEntryTypeDropdown.value = false
      break
    case 'modeOfTransport':
      showModeOfTransportDropdown.value = false
      break
    case 'uom':
      showUomDropdown.value = false
      break
    case 'zoneStatus':
      showZoneStatusDropdown.value = false
      break
    case 'actionCode':
      showActionCodeDropdown.value = false
      break
    case 'directDelivery':
      showDirectDeliveryDropdown.value = false
      break
  }
}

const toggleDropdown = (type: string) => {
  switch (type) {
    case 'portOfEntry':
      showPortOfEntryDropdown.value = !showPortOfEntryDropdown.value
      showAdmissionTypeDropdown.value = false
      showEntryTypeDropdown.value = false
      showModeOfTransportDropdown.value = false
      showUomDropdown.value = false
      showZoneStatusDropdown.value = false
      showActionCodeDropdown.value = false
      break
    case 'admissionType':
      showAdmissionTypeDropdown.value = !showAdmissionTypeDropdown.value
      showPortOfEntryDropdown.value = false
      showEntryTypeDropdown.value = false
      showModeOfTransportDropdown.value = false
      showUomDropdown.value = false
      showZoneStatusDropdown.value = false
      showActionCodeDropdown.value = false
      break
    case 'entryType':
      showEntryTypeDropdown.value = !showEntryTypeDropdown.value
      showPortOfEntryDropdown.value = false
      showAdmissionTypeDropdown.value = false
      showModeOfTransportDropdown.value = false
      showUomDropdown.value = false
      showZoneStatusDropdown.value = false
      showActionCodeDropdown.value = false
      break
    case 'modeOfTransport':
      showModeOfTransportDropdown.value = !showModeOfTransportDropdown.value
      showPortOfEntryDropdown.value = false
      showAdmissionTypeDropdown.value = false
      showEntryTypeDropdown.value = false
      showUomDropdown.value = false
      showZoneStatusDropdown.value = false
      showActionCodeDropdown.value = false
      break
    case 'uom':
      showUomDropdown.value = !showUomDropdown.value
      showPortOfEntryDropdown.value = false
      showAdmissionTypeDropdown.value = false
      showEntryTypeDropdown.value = false
      showModeOfTransportDropdown.value = false
      showZoneStatusDropdown.value = false
      showActionCodeDropdown.value = false
      break
    case 'zoneStatus':
      showZoneStatusDropdown.value = !showZoneStatusDropdown.value
      showPortOfEntryDropdown.value = false
      showAdmissionTypeDropdown.value = false
      showEntryTypeDropdown.value = false
      showModeOfTransportDropdown.value = false
      showUomDropdown.value = false
      showActionCodeDropdown.value = false
      break
    case 'actionCode':
      showActionCodeDropdown.value = !showActionCodeDropdown.value
      showPortOfEntryDropdown.value = false
      showAdmissionTypeDropdown.value = false
      showEntryTypeDropdown.value = false
      showModeOfTransportDropdown.value = false
      showUomDropdown.value = false
      showZoneStatusDropdown.value = false
      break
    case 'directDelivery':
      showDirectDeliveryDropdown.value = !showDirectDeliveryDropdown.value
      showPortOfEntryDropdown.value = false
      showAdmissionTypeDropdown.value = false
      showEntryTypeDropdown.value = false
      showModeOfTransportDropdown.value = false
      showUomDropdown.value = false
      showZoneStatusDropdown.value = false
      break
  }
}

const handleSearchInput = (type: string) => {
  switch (type) {
    case 'portOfEntry':
      showPortOfEntryDropdown.value = true
      break
    case 'admissionType':
      showAdmissionTypeDropdown.value = true
      break
    case 'entryType':
      showEntryTypeDropdown.value = true
      break
    case 'modeOfTransport':
      showModeOfTransportDropdown.value = true
      break
    case 'uom':
      showUomDropdown.value = true
      break
    case 'zoneStatus':
      showZoneStatusDropdown.value = true
      break
    case 'actionCode':
      showActionCodeDropdown.value = true
      break
    case 'directDelivery':
      showDirectDeliveryDropdown.value = true
      break
  }
}

const handleSelectOption = (field: string, value: string) => {
  switch (field) {
    case 'portOfEntry':
      formData.value.zoneInformation.portOfEntry = value
      portOfEntrySearch.value = ''
      showPortOfEntryDropdown.value = false
      break
    case 'admissionType':
      formData.value.headerInformation.admissionType = value as AdmissionType
      // 如果当前的 Entry Type 与新的 Admission Type 不兼容，清空 Entry Type
      if (!filteredEntryTypesByAdmissionType.value.find(t => t.value === formData.value.headerInformation.entryType)) {
        formData.value.headerInformation.entryType = ''
      }
      showAdmissionTypeDropdown.value = false
      break
    case 'entryType':
      formData.value.headerInformation.entryType = value as EntryType
      // 如果当前的 Admission Type 与新的 Entry Type 不兼容，清空 Admission Type
      if (!filteredAdmissionTypesByEntryType.value.find(t => t.value === formData.value.headerInformation.admissionType)) {
        formData.value.headerInformation.admissionType = ''
      }
      showEntryTypeDropdown.value = false
      break
    case 'modeOfTransport':
      formData.value.transportationInformation.modeOfTransport = value as TransportMode
      showModeOfTransportDropdown.value = false
      showPortOfEntryDropdown.value = false
      showAdmissionTypeDropdown.value = false
      showEntryTypeDropdown.value = false
      showUomDropdown.value = false
      showZoneStatusDropdown.value = false
      showActionCodeDropdown.value = false
      break
    case 'uom':
      formData.value.billOfLading.uom = value as UnitOfMeasure
      showUomDropdown.value = false
      showPortOfEntryDropdown.value = false
      showAdmissionTypeDropdown.value = false
      showEntryTypeDropdown.value = false
      showModeOfTransportDropdown.value = false
      showZoneStatusDropdown.value = false
      showActionCodeDropdown.value = false
      break
    case 'zoneStatus':
      formData.value.lineItems.forEach(item => {
        item.zoneStatus = value as ZoneStatus
      })
      showZoneStatusDropdown.value = false
      break
    case 'actionCode':
      formData.value.headerInformation.actionCode = value as ActionCode
      actionCodeSearch.value = ''
      showActionCodeDropdown.value = false
      break
    case 'directDelivery':
      formData.value.headerInformation.directDeliveryIndicator = value as DirectDeliveryIndicator
      directDeliverySearch.value = ''
      showDirectDeliveryDropdown.value = false
      break
  }
}

const clearSelect = (type: string) => {
  switch (type) {
    case 'portOfEntry':
      formData.value.zoneInformation.portOfEntry = ''
      portOfEntrySearch.value = ''
      break
    case 'admissionType':
      formData.value.headerInformation.admissionType = ''
      admissionTypeSearch.value = ''
      showAdmissionTypeDropdown.value = false
      break
    case 'entryType':
      formData.value.headerInformation.entryType = ''
      entryTypeSearch.value = ''
      showEntryTypeDropdown.value = false
      break
    case 'modeOfTransport':
      formData.value.transportationInformation.modeOfTransport = ''
      modeOfTransportSearch.value = ''
      showModeOfTransportDropdown.value = false
      break
    case 'uom':
      formData.value.billOfLading.uom = ''
      uomSearch.value = ''
      showUomDropdown.value = false
      break
    case 'zoneStatus':
      formData.value.lineItems.forEach(item => {
        item.zoneStatus = ''
      })
      zoneStatusSearch.value = ''
      showZoneStatusDropdown.value = false
      break
    case 'actionCode':
      formData.value.headerInformation.actionCode = ''
      actionCodeSearch.value = ''
      showActionCodeDropdown.value = false
      break
    case 'directDelivery':
      formData.value.headerInformation.directDeliveryIndicator = ''
      directDeliverySearch.value = ''
      showDirectDeliveryDropdown.value = false
      break
  }
}

// 事件处理
const handleBack = () => {
  router.back()
}

const handleCancel = () => {
  router.back()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // TODO: 实现表单提交逻辑
    console.log('Form submitted:', formData.value)
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}

const addLineItem = () => {
  formData.value.lineItems.push({
    usePartsInventory: false,
    partNumber: '',
    htsCode: '',
    pieceCount: 0,
    value: 0,
    charges: 0,
    midReference: '',
    assignedContainer: '',
    description: '',
    lotNumber: '',
    countryOfOrigin: '',
    qty: 0,
    weight: 0,
    zoneStatus: '',
    remarks: '',
    pnDisclaimer: false,
    priorNoticeNumber: ''
  })
}

const removeLineItem = (index: number) => {
  formData.value.lineItems.splice(index, 1)
}

const isDeleteMode = computed(() => formData.value.headerInformation.actionCode === 'D')

const showAdditionalFields = computed(() => {
  return ['zone_to_zone', 'temporary'].includes(formData.value.headerInformation.admissionType)
})

// 根据 Entry Type 过滤 Admission Type 选项
const filteredAdmissionTypesByEntryType = computed(() => {
  const entryType = formData.value.headerInformation.entryType
  if (!entryType) return ADMISSION_TYPES

  switch (entryType) {
    case '23':
      return ADMISSION_TYPES.filter(t => t.value === 'temporary')
    case '26':
      return ADMISSION_TYPES.filter(t => t.value === 'domestic')
    case '06':
      return ADMISSION_TYPES.filter(t => ['regular', 'zone_to_zone'].includes(t.value))
    case '24':
    case '25':
    case '27':
      return ADMISSION_TYPES.filter(t => 
        ['regular', 'status_change', 'overage', 'zone_to_zone'].includes(t.value)
      )
    default:
      return ADMISSION_TYPES
  }
})

// 根据 Admission Type 过滤 Entry Type 选项
const filteredEntryTypesByAdmissionType = computed(() => {
  const admissionType = formData.value.headerInformation.admissionType
  if (!admissionType) return ENTRY_TYPES

  switch (admissionType) {
    case 'regular':
      return ENTRY_TYPES.filter(t => ['24', '25', '26', '27', '06'].includes(t.value))
    case 'status_change':
    case 'overage':
      return ENTRY_TYPES.filter(t => ['24', '25', '26', '27'].includes(t.value))
    case 'zone_to_zone':
      return ENTRY_TYPES.filter(t => ['24', '25', '26', '27', '06'].includes(t.value))
    case 'temporary':
      return ENTRY_TYPES.filter(t => t.value === '23')
    case 'domestic':
      return ENTRY_TYPES.filter(t => t.value === '26')
    default:
      return ENTRY_TYPES
  }
})
</script>

<style lang="scss" scoped>
.ftze214-edit-page {
  --form-bg: var(--el-bg-color);
  --section-bg: var(--el-bg-color-overlay);
  --border-color: var(--el-border-color);
  --text-primary: var(--el-text-color-primary);
  --text-regular: var(--el-text-color-regular);
  --text-secondary: var(--el-text-color-secondary);
  --input-bg: var(--el-fill-color-light);
  --primary-color: #6366f1;
  --primary-hover: #818cf8;

  background-color: var(--form-bg);
  min-height: 100vh;
  padding: 24px;

  .page-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .fixed-header {
  margin-bottom: 24px;
    padding: 20px 24px;
    background: var(--section-bg);
    border-radius: 8px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 16px;

    .back-button {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-secondary);
      cursor: pointer;
      transition: color 0.15s;

      &:hover {
        color: var(--primary-color);
      }
    }

    .title {
      font-size: 18px;
      color: var(--text-primary);
      font-weight: 600;
    }
  }

  .form-container {
    .form-section {
      background: var(--section-bg);
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);

      .section-title {
        font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
        margin-bottom: 24px;
        text-transform: uppercase;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .form-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .line-items-container {
        .line-item {
          background: var(--section-bg);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

          &:last-child {
            margin-bottom: 0;
          }

          .line-item-header {
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .line-item-title {
              font-size: 14px;
              color: var(--text-primary);
              font-weight: 500;
            }
          }
          
          .line-item-content {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          
          .line-item-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;

            .checkbox-item {
              display: flex;
              align-items: center;
              margin-top: 32px;
            }
          }
        }
      }
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 0;
    
    .el-form-item__label {
      color: var(--text-primary);
      font-weight: 500;
      padding-bottom: 6px;
      line-height: 1.25;
    }
    
    &.is-required .el-form-item__label:before {
      color: var(--el-color-danger);
    }

    // 统一输入框、下拉框和数字输入框的背景色
    .el-input__wrapper,
    .el-select .el-input__wrapper,
    .el-date-editor.el-input__wrapper,
    .el-textarea__wrapper,
    .el-input-number.is-controls-right .el-input__wrapper,
    .el-input-number .el-input__wrapper {
      background-color: var(--input-bg) !important;
      box-shadow: none !important;
      border: 1px solid transparent !important;
      transition: all 0.15s ease-in-out;
      
      &:hover {
        background-color: var(--el-fill-color-darker) !important;
        border-color: var(--el-border-color-hover) !important;
      }
      
      &.is-focus {
        background-color: var(--el-fill-color-darker) !important;
        border-color: var(--primary-color) !important;
      }
    }

    // 修改数字输入框的样式，使其加减按钮变成图标样式
    .el-input-number {
      width: 100%;
      
      .el-input-number__decrease,
      .el-input-number__increase {
        background: transparent !important;
        border: none !important;
        width: 24px !important;
        height: 18px !important;
        line-height: 18px !important;
        padding: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        
        &:hover {
          color: var(--primary-color) !important;
        }
        
        .el-icon {
          width: 12px !important;
          height: 12px !important;
          font-size: 12px !important;
        }
      }

      .el-input-number__decrease {
        border-radius: 0 0 4px 0 !important;
        bottom: 0 !important;
      }

      .el-input-number__increase {
        border-radius: 0 4px 0 0 !important;
        top: 0 !important;
      }

      .el-input__wrapper {
        padding-right: 24px !important;
      }
    }
    
    .el-input__inner {
      height: 36px;
      padding: 8px 12px;
      font-size: 14px;
      color: var(--text-primary);
      
      &::placeholder {
    color: var(--text-secondary);
      }
    }
    
    .el-textarea__inner {
      padding: 8px 12px;
    font-size: 14px;
      color: var(--text-primary);
      
      &::placeholder {
        color: var(--text-secondary);
      }
    }

    .el-select {
      width: 100%;
    }

    .el-date-editor {
      width: 100%;
    }

    .el-checkbox {
      color: var(--text-primary);

      :deep(.el-checkbox__input) {
        .el-checkbox__inner {
          border-color: var(--text-secondary);
          background-color: var(--input-bg);
          
          &:hover {
            border-color: var(--primary-color);
          }
        }

        &.is-checked {
          .el-checkbox__inner {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
          }
        }

        &.is-focus {
          .el-checkbox__inner {
            border-color: var(--primary-color);
          }
        }
      }

      &:hover {
        .el-checkbox__inner {
          border-color: var(--primary-color);
        }
      }

      &.is-checked {
        .el-checkbox__label {
          color: var(--primary-color);
        }
      }
    }
  }

  .form-actions {
    background: var(--section-bg);
  border-radius: 8px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    padding: 16px 24px;
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    
    .el-button {
      min-width: 100px;
      height: 36px;
      
      &.el-button--primary {
        background: var(--primary-color);
        border-color: var(--primary-color);
        
        &:hover {
          background: var(--primary-hover);
          border-color: var(--primary-hover);
        }
      }
      
      &.el-button--default {
        background: var(--input-bg);
        border: none;
        color: var(--text-primary);
        
        &:hover {
          color: var(--primary-color);
          background: var(--el-fill-color-light);
        }
      }
    }
  }
}

.custom-select {
  position: relative;
  width: 100%;

  .select-trigger {
    position: relative;
    width: 100%;
    height: 36px;
    border: 1px solid transparent;
    border-radius: 4px;
    background: var(--input-bg);
    transition: all 0.15s ease-in-out;
    cursor: pointer;

    &:hover {
      background-color: var(--el-fill-color-darker) !important;
      border-color: var(--el-border-color-hover) !important;
    }

    &.is-focus {
      background-color: var(--el-fill-color-darker) !important;
      border-color: var(--primary-color) !important;
    }

    input {
      width: 100%;
      height: 100%;
      padding: 0 64px 0 12px;
      border: none;
      background: transparent;
      color: var(--text-primary);
      font-size: 14px;
      cursor: pointer;

      &:focus {
        outline: none;
      }

      &::placeholder {
        color: var(--text-secondary);
      }
    }

    .select-icons {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
  display: flex;
  align-items: center;
      gap: 4px;

      .clear-icon {
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 16px;
        padding: 2px;
        border-radius: 50%;
        transition: all 0.3s;
        opacity: 0;

        &:hover {
          color: var(--text-primary);
        }
      }

      .el-icon {
        font-size: 16px;
        color: var(--text-secondary);
        transition: transform 0.3s;

        &.is-reverse {
          transform: rotate(180deg);
        }
      }
    }

    &:hover .clear-icon {
      opacity: 1;
    }
  }

  .select-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background: var(--el-bg-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    box-shadow: var(--el-box-shadow-light);
    z-index: 10;
    max-height: 200px;
    overflow-y: auto;

    .select-option {
      padding: 8px 12px;
      cursor: pointer;
      font-size: 14px;
      color: var(--text-regular);
      transition: all 0.15s ease-in-out;

      &:hover {
        background: var(--el-fill-color-light);
      }

      &.active {
        color: var(--primary-color);
        background: rgba(99, 102, 241, 0.1);
      }
    }
  }
}

// 暗色主题适配
html.dark {
  .ftze214-edit-page {
    --form-bg: var(--el-bg-color-overlay);
    --section-bg: var(--el-bg-color);
    --border-color: var(--el-border-color-dark);
    --text-primary: var(--el-text-color-primary);
    --text-regular: var(--el-text-color-regular);
    --text-secondary: var(--el-text-color-secondary);
    --input-bg: var(--el-fill-color-dark);
    --primary-color: #818cf8;
    --primary-hover: #6366f1;
  }
}
</style> 