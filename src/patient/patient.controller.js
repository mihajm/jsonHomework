"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.PatientController = void 0;
var openapi = require("@nestjs/swagger");
var common_1 = require("@nestjs/common");
var PatientController = /** @class */ (function () {
    function PatientController(patientService) {
        this.patientService = patientService;
    }
    PatientController.prototype.findAll = function () {
        return this.patientService.findAll();
    };
    PatientController.prototype.findOne = function (id) {
        return this.patientService.findOne(id);
    };
    PatientController.prototype.create = function (createPatientDto) {
        return this.patientService.create(createPatientDto);
    };
    PatientController.prototype.update = function (id, updatePatientDto) {
        return this.patientService.update(id, updatePatientDto);
    };
    PatientController.prototype.remove = function (id) {
        return this.patientService.remove(id);
    };
    __decorate([
        common_1.Get(),
        openapi.ApiResponse({ status: 200, type: [require("./entitites/patient.entity").Patient] })
    ], PatientController.prototype, "findAll");
    __decorate([
        common_1.Get(':id'),
        openapi.ApiResponse({ status: 200, type: require("./entitites/patient.entity").Patient }),
        __param(0, common_1.Param('id'))
    ], PatientController.prototype, "findOne");
    __decorate([
        common_1.Post(),
        openapi.ApiResponse({ status: 201, type: require("./entitites/patient.entity").Patient }),
        __param(0, common_1.Body())
    ], PatientController.prototype, "create");
    __decorate([
        common_1.Patch(':id'),
        openapi.ApiResponse({ status: 200, type: require("./entitites/patient.entity").Patient }),
        __param(0, common_1.Param('id')), __param(1, common_1.Body())
    ], PatientController.prototype, "update");
    __decorate([
        common_1.Delete(':id'),
        openapi.ApiResponse({ status: 200, type: require("./entitites/patient.entity").Patient }),
        __param(0, common_1.Param('id'))
    ], PatientController.prototype, "remove");
    PatientController = __decorate([
        common_1.Controller('patient')
    ], PatientController);
    return PatientController;
}());
exports.PatientController = PatientController;
