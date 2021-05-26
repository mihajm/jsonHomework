"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Disease = void 0;
var openapi = require("@nestjs/swagger");
var patient_entity_1 = require("../../../../../../../../../src/patient/entitites/patient.entity");
var typeorm_1 = require("typeorm");
var Disease = /** @class */ (function () {
    function Disease() {
    }
    Disease._OPENAPI_METADATA_FACTORY = function () {
        return { ID: { required: true, type: function () { return Number; } }, name: { required: true, type: function () { return String; } }, patient: { required: true, type: function () { return [Object]; } } };
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Disease.prototype, "ID");
    __decorate([
        typeorm_1.Column({ name: 'NAME' })
    ], Disease.prototype, "name");
    __decorate([
        typeorm_1.ManyToMany(function (type) { return patient_entity_1.Patient; }, function (patients) { return patients.diseases; })
    ], Disease.prototype, "patient");
    Disease = __decorate([
        typeorm_1.Entity('DISEASES')
    ], Disease);
    return Disease;
}());
exports.Disease = Disease;
