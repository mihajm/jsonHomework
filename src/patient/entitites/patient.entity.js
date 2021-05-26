"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Patient = void 0;
var openapi = require("@nestjs/swagger");
var disease_entity_1 = require("../../../../../../../../../src/disease/entities/disease.entity");
var doctor_entity_1 = require("../../../../../../../../../src/doctor/entities/doctor.entity");
var typeorm_1 = require("typeorm");
var Patient = /** @class */ (function () {
    function Patient() {
    }
    Patient._OPENAPI_METADATA_FACTORY = function () {
        return { id: { required: true, type: function () { return String; } }, doctor: { required: true, type: function () { return Object; } }, first_name: { required: true, type: function () { return String; } }, last_name: { required: true, type: function () { return String; } }, diseases: { required: true, type: function () { return [Object]; } } };
    };
    __decorate([
        typeorm_1.PrimaryColumn({ name: 'ID' })
    ], Patient.prototype, "id");
    __decorate([
        typeorm_1.ManyToOne(function () { return doctor_entity_1.Doctor; }, function (doctor) { return doctor.patients; }),
        typeorm_1.JoinColumn({ name: 'DOCTOR_ID' })
    ], Patient.prototype, "doctor");
    __decorate([
        typeorm_1.Column({ name: 'FIRST_NAME' })
    ], Patient.prototype, "first_name");
    __decorate([
        typeorm_1.Column({ name: 'LAST_NAME' })
    ], Patient.prototype, "last_name");
    __decorate([
        typeorm_1.ManyToMany(function (type) { return disease_entity_1.Disease; }, function (diseases) { return diseases.patient; }, {
            cascade: true
        }),
        typeorm_1.JoinTable({
            name: 'PATIENT_DISEASE',
            joinColumn: { name: 'PATIENT_ID', referencedColumnName: 'id' },
            inverseJoinColumn: { name: 'DISEASE_ID', referencedColumnName: 'ID' }
        })
    ], Patient.prototype, "diseases");
    Patient = __decorate([
        typeorm_1.Entity('PATIENTS')
    ], Patient);
    return Patient;
}());
exports.Patient = Patient;
