const { v4: uuid } = require('uuid');
const NotFoundException = require('../../../exceptions/NotFoundException');
const MatchRepository = require('../../../repositories/matchRepository');
const IncrementControllerSequenceUseCase = require('../IncrementControllerSequence/IncrementControllerSequenceUseCase');
const ChangeControlValidator = require('./ChangeControlValidator');

class ChangeControlUseCase {
  /**
   * ChangeControlUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {IncrementControllerSequenceUseCase} container.incrementControllerSequenceUseCase - IncrementControllerSequenceUseCase
   * @param {ChangeControlValidator} container.changeControlValidator
   * @param {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({ matchRepository, incrementControllerSequenceUseCase, changeControlValidator }) {
    this.matchRepository = matchRepository;
    this.incrementControllerSequenceUseCase = incrementControllerSequenceUseCase;
    this.changeControlValidator = changeControlValidator;
  }

  async execute(refreshToken) {
    this.changeControlValidator.validate(refreshToken);

    const match = await this.matchRepository.findByRefreshToken(refreshToken);

    if (!match) {
      throw new NotFoundException('partida', 'token', refreshToken);
    }

    return {
      ...await this.generateNewTokens(match),
      controllerSequence: await this.getControllerSequence(match),
      brokerTopic: match.brokerTopic,
      matchId: match.id,
    };
  }

  async generateNewTokens(match) {
    const publishToken = uuid();
    const refreshToken = uuid();

    await this.matchRepository.updateTokens(match.id, { publishToken, refreshToken });

    return {
      publishToken,
      refreshToken,
    };
  }

  async getControllerSequence(match) {
    return this.incrementControllerSequenceUseCase.execute({
      id: match.id,
      topic: match.brokerTopic,
    });
  }
}

module.exports = ChangeControlUseCase;
