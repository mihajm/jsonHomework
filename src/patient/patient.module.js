"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PatientModule = void 0;
var common_1 = require("@nestjs/common");
var patient_service_1 = require("./patient.service");
var patient_controller_1 = require("./patient.controller");
var typeorm_1 = require("@nestjs/typeorm");
var patient_entity_1 = require("./entitites/patient.entity");
var disease_module_1 = require("../../../../../../../../src/disease/disease.module");
var PatientModule = /** @class */ (function () {
    function PatientModule() {
    }
    PatientModule = __decorate([
        common_1.Module({
            imports: [disease_module_1.DiseaseModule, typeorm_1.TypeOrmModule.forFeature([patient_entity_1.Patient])],
            providers: [patient_service_1.PatientService],
            controllers: [patient_controller_1.PatientController],
            exports: [patient_service_1.PatientService]
        })
    ], PatientModule);
    return PatientModule;
}());
exports.PatientModule = PatientModule;
