"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.PatientService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var disease_service_1 = require("../../../../../../../../src/disease/disease.service");
var disease_dto_1 = require("../../../../../../../../src/disease/dto/disease.dto");
var patient_entity_1 = require("./entitites/patient.entity");
var PatientService = /** @class */ (function () {
    function PatientService(patientRepository, diseaseService) {
        this.patientRepository = patientRepository;
        this.diseaseService = diseaseService;
    }
    //checks if a patient exists & returns that patient if it does, otherwise creates a new patient in db & returns a Promise
    PatientService.prototype.preloadPatientById = function (createPatientDto) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var patient, diseases;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.patientRepository.findOne(createPatientDto.id)];
                    case 1:
                        patient = _b.sent();
                        if (patient)
                            return [2 /*return*/, patient];
                        return [4 /*yield*/, Promise.all((_a = createPatientDto.diseases) === null || _a === void 0 ? void 0 : _a.map(function (diseaseName) {
                                var disease = {
                                    name: diseaseName
                                };
                                return _this.diseaseService.preloadDiseaseByName(disease);
                            }))];
                    case 2:
                        diseases = _b.sent();
                        return [4 /*yield*/, this.patientRepository.create(__assign(__assign({}, createPatientDto), { diseases: diseases }))];
                    case 3: 
                    //creates a patient, with associated diseases
                    return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    PatientService.prototype.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.patientRepository.find({
                            relations: ['diseases']
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PatientService.prototype.findOne = function (id, skipError) {
        if (skipError === void 0) { skipError = false; }
        return __awaiter(this, void 0, void 0, function () {
            var patient;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.patientRepository.findOne(id, {
                            relations: ['diseases']
                        })];
                    case 1:
                        patient = _a.sent();
                        if (!patient && !skipError)
                            throw new common_1.NotFoundException("Patient with id: " + id + " not found");
                        return [2 /*return*/, patient];
                }
            });
        });
    };
    PatientService.prototype.create = function (createPatientDto) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var diseases, _b, doctor;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.patientRepository.findOne(createPatientDto.id)];
                    case 1:
                        //checks if Patient exists & throws an exception if it finds one with the same id
                        if (_c.sent()) {
                            throw new common_1.BadRequestException("Patient with id: " + createPatientDto.id + " already exists, did you mean to update the data?");
                        }
                        _b = createPatientDto.diseases;
                        if (!_b) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.all((_a = createPatientDto.diseases) === null || _a === void 0 ? void 0 : _a.map(function (disease) {
                                var createDiseaseDto = {
                                    name: disease
                                };
                                return _this.diseaseService.preloadDiseaseByName(createDiseaseDto);
                            }))];
                    case 2:
                        _b = (_c.sent());
                        _c.label = 3;
                    case 3:
                        diseases = _b;
                        return [4 /*yield*/, this.patientRepository.create(__assign(__assign({}, createPatientDto), { diseases: diseases }))];
                    case 4:
                        doctor = _c.sent();
                        return [4 /*yield*/, this.patientRepository.save(doctor)];
                    case 5: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    PatientService.prototype.update = function (id, updatePatientDto) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var diseases, _b, patient;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = updatePatientDto.diseases;
                        if (!_b) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all((_a = updatePatientDto.diseases) === null || _a === void 0 ? void 0 : _a.map(function (disease) { return __awaiter(_this, void 0, void 0, function () {
                                var diseaseId, updateDiseaseDto, createDiseaseDto;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.diseaseService.findOneByName(disease)];
                                        case 1:
                                            diseaseId = _a.sent();
                                            if (!diseaseId) return [3 /*break*/, 2];
                                            updateDiseaseDto = {
                                                name: disease
                                            };
                                            return [2 /*return*/, this.diseaseService.update(diseaseId, updateDiseaseDto)];
                                        case 2:
                                            createDiseaseDto = {
                                                name: disease
                                            };
                                            return [4 /*yield*/, this.diseaseService.create(createDiseaseDto)];
                                        case 3: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }))];
                    case 1:
                        _b = (_c.sent());
                        _c.label = 2;
                    case 2:
                        diseases = _b;
                        return [4 /*yield*/, this.patientRepository.preload(__assign(__assign({ id: id }, updatePatientDto), { diseases: diseases }))];
                    case 3:
                        patient = _c.sent();
                        if (!patient)
                            throw new common_1.NotFoundException("Patient with id: " + id + " not found");
                        return [4 /*yield*/, this.patientRepository.save(patient)];
                    case 4: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    PatientService.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var patient;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        patient = _a.sent();
                        return [4 /*yield*/, this.patientRepository.remove(patient)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PatientService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(patient_entity_1.Patient))
    ], PatientService);
    return PatientService;
}());
exports.PatientService = PatientService;