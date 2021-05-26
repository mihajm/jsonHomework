"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DoctorModule = void 0;
var common_1 = require("@nestjs/common");
var doctor_service_1 = require("./doctor.service");
var doctor_controller_1 = require("./doctor.controller");
var patient_module_1 = require("../../../../../../../../src/patient/patient.module");
var disease_module_1 = require("../../../../../../../../src/disease/disease.module");
var typeorm_1 = require("@nestjs/typeorm");
var doctor_entity_1 = require("./entities/doctor.entity");
var patient_entity_1 = require("../../../../../../../../src/patient/entitites/patient.entity");
var disease_entity_1 = require("../../../../../../../../src/disease/entities/disease.entity");
var DoctorModule = /** @class */ (function () {
    function DoctorModule() {
    }
    DoctorModule = __decorate([
        common_1.Module({
            imports: [
                patient_module_1.PatientModule,
                disease_module_1.DiseaseModule,
                typeorm_1.TypeOrmModule.forFeature([doctor_entity_1.Doctor, patient_entity_1.Patient, disease_entity_1.Disease]),
            ],
            providers: [doctor_service_1.DoctorService],
            controllers: [doctor_controller_1.DoctorController],
            exports: [doctor_service_1.DoctorService]
        })
    ], DoctorModule);
    return DoctorModule;
}());
exports.DoctorModule = DoctorModule;
