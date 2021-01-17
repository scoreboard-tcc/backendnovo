const { addMinutes } = require('date-fns');
const BusinessException = require('../../../exceptions/BusinessException');
const NotFoundException = require('../../../exceptions/NotFoundException');
const MatchRepository = require('../../../repositories/matchRepository');
const validateSchema = require('../../../utils/validation');
const CheckPinValidator = require('./CheckPinValidator');

class CheckPinUseCase {
  /**
   * CheckPinUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({ matchRepository }) {
    this.matchRepository = matchRepository;
  }

  validate(request) {
    validateSchema(CheckPinValidator, request);
  }

  async execute(request) {
    this.validate(request);

    const match = await this.matchRepository.findByMatchIdAndPinAndIngame(request.matchId, request.pin);

    if (!match) {
      throw new BusinessException('Id da partida ou PIN incorreto(s)');
    }

    return {
      id: match.id,
      brokerTopic: match.brokerTopic,
      expiration: addMinutes(new Date(match.startedAt), match.duration),
    };
  }
}

module.exports = CheckPinUseCase;