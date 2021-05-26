"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Doctor = void 0;
var openapi = require("@nestjs/swagger");
var patient_entity_1 = require("../../../../../../../../../src/patient/entitites/patient.entity");
var typeorm_1 = require("typeorm");
var Doctor = /** @class */ (function () {
    function Doctor() {
    }
    Doctor._OPENAPI_METADATA_FACTORY = function () {
        return { id: { required: true, type: function () { return String; } }, department: { required: true, type: function () { return String; } }, patients: { required: true, type: function () { return [Object]; } } };
    };
    __decorate([
        typeorm_1.PrimaryColumn({ name: 'ID' })
    ], Doctor.prototype, "id");
    __decorate([
        typeorm_1.Column({ name: 'DEPARTMENT' })
    ], Doctor.prototype, "department");
    __decorate([
        typeorm_1.OneToMany(function () { return patient_entity_1.Patient; }, function (patient) { return patient.doctor; }, { cascade: true })
    ], Doctor.prototype, "patients");
    Doctor = __decorate([
        typeorm_1.Entity('DOCTORS')
    ], Doctor);
    return Doctor;
}());
exports.Doctor = Doctor;
