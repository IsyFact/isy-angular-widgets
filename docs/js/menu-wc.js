'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">@isyfact/isy-angular-widgets documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/HauptfensterModule.html" data-type="entity-link" >HauptfensterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-HauptfensterModule-dda5f601df2426fc1f3e73059e524e2233ea7160de49a050add561e47091100a5e28e3b7209ebfb531dabc99696be87bffb716aba194793741eb53b4a7d2e150"' : 'data-bs-target="#xs-components-links-module-HauptfensterModule-dda5f601df2426fc1f3e73059e524e2233ea7160de49a050add561e47091100a5e28e3b7209ebfb531dabc99696be87bffb716aba194793741eb53b4a7d2e150"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HauptfensterModule-dda5f601df2426fc1f3e73059e524e2233ea7160de49a050add561e47091100a5e28e3b7209ebfb531dabc99696be87bffb716aba194793741eb53b4a7d2e150"' :
                                            'id="xs-components-links-module-HauptfensterModule-dda5f601df2426fc1f3e73059e524e2233ea7160de49a050add561e47091100a5e28e3b7209ebfb531dabc99696be87bffb716aba194793741eb53b4a7d2e150"' }>
                                            <li class="link">
                                                <a href="components/HauptfensterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HauptfensterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/IncompleteDateModule.html" data-type="entity-link" >IncompleteDateModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-IncompleteDateModule-c55674de354745bbbf7b37f0a1dd108a641f3e4cb35cc99f5f88e42606632658e2b29a634d5715e4d8fbbc639a06d63a58e5b3855d3e92630faa3fd162a63067"' : 'data-bs-target="#xs-components-links-module-IncompleteDateModule-c55674de354745bbbf7b37f0a1dd108a641f3e4cb35cc99f5f88e42606632658e2b29a634d5715e4d8fbbc639a06d63a58e5b3855d3e92630faa3fd162a63067"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-IncompleteDateModule-c55674de354745bbbf7b37f0a1dd108a641f3e4cb35cc99f5f88e42606632658e2b29a634d5715e4d8fbbc639a06d63a58e5b3855d3e92630faa3fd162a63067"' :
                                            'id="xs-components-links-module-IncompleteDateModule-c55674de354745bbbf7b37f0a1dd108a641f3e4cb35cc99f5f88e42606632658e2b29a634d5715e4d8fbbc639a06d63a58e5b3855d3e92630faa3fd162a63067"' }>
                                            <li class="link">
                                                <a href="components/IncompleteDateComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IncompleteDateComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/InputCharModule.html" data-type="entity-link" >InputCharModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-InputCharModule-01989a1ca7a482dbb59a93c25c4ae39791e7a2b3e479c80c91ed47c9954ec2dfd678df3a33c44dcc0d3ed8b2e42aa4e3f320c55c3ddd4159becbcd6b32bcfb98"' : 'data-bs-target="#xs-components-links-module-InputCharModule-01989a1ca7a482dbb59a93c25c4ae39791e7a2b3e479c80c91ed47c9954ec2dfd678df3a33c44dcc0d3ed8b2e42aa4e3f320c55c3ddd4159becbcd6b32bcfb98"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-InputCharModule-01989a1ca7a482dbb59a93c25c4ae39791e7a2b3e479c80c91ed47c9954ec2dfd678df3a33c44dcc0d3ed8b2e42aa4e3f320c55c3ddd4159becbcd6b32bcfb98"' :
                                            'id="xs-components-links-module-InputCharModule-01989a1ca7a482dbb59a93c25c4ae39791e7a2b3e479c80c91ed47c9954ec2dfd678df3a33c44dcc0d3ed8b2e42aa4e3f320c55c3ddd4159becbcd6b32bcfb98"' }>
                                            <li class="link">
                                                <a href="components/InputCharComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InputCharComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-InputCharModule-01989a1ca7a482dbb59a93c25c4ae39791e7a2b3e479c80c91ed47c9954ec2dfd678df3a33c44dcc0d3ed8b2e42aa4e3f320c55c3ddd4159becbcd6b32bcfb98"' : 'data-bs-target="#xs-directives-links-module-InputCharModule-01989a1ca7a482dbb59a93c25c4ae39791e7a2b3e479c80c91ed47c9954ec2dfd678df3a33c44dcc0d3ed8b2e42aa4e3f320c55c3ddd4159becbcd6b32bcfb98"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-InputCharModule-01989a1ca7a482dbb59a93c25c4ae39791e7a2b3e479c80c91ed47c9954ec2dfd678df3a33c44dcc0d3ed8b2e42aa4e3f320c55c3ddd4159becbcd6b32bcfb98"' :
                                        'id="xs-directives-links-module-InputCharModule-01989a1ca7a482dbb59a93c25c4ae39791e7a2b3e479c80c91ed47c9954ec2dfd678df3a33c44dcc0d3ed8b2e42aa4e3f320c55c3ddd4159becbcd6b32bcfb98"' }>
                                        <li class="link">
                                            <a href="directives/InputCharDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InputCharDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SecurityModule.html" data-type="entity-link" >SecurityModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-SecurityModule-5539fbdb2fb1b4a14b563297f7efbcb6b827cdb2790228ec315d73881faaf85fe027c64de0642de3ec48cae74f053e612ff52e23ce79170f585c4149c0fe4471"' : 'data-bs-target="#xs-directives-links-module-SecurityModule-5539fbdb2fb1b4a14b563297f7efbcb6b827cdb2790228ec315d73881faaf85fe027c64de0642de3ec48cae74f053e612ff52e23ce79170f585c4149c0fe4471"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SecurityModule-5539fbdb2fb1b4a14b563297f7efbcb6b827cdb2790228ec315d73881faaf85fe027c64de0642de3ec48cae74f053e612ff52e23ce79170f585c4149c0fe4471"' :
                                        'id="xs-directives-links-module-SecurityModule-5539fbdb2fb1b4a14b563297f7efbcb6b827cdb2790228ec315d73881faaf85fe027c64de0642de3ec48cae74f053e612ff52e23ce79170f585c4149c0fe4471"' }>
                                        <li class="link">
                                            <a href="directives/SecurityDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SecurityDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/WizardModule.html" data-type="entity-link" >WizardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-WizardModule-702a692e70ffcc7aba99ebe1e16df24223e210b0ec111622d0a14ce68668339fe3fbf8a94fdd44969f9829ce29ea83128e83d84157e51588a55fc02dbaac5a47"' : 'data-bs-target="#xs-components-links-module-WizardModule-702a692e70ffcc7aba99ebe1e16df24223e210b0ec111622d0a14ce68668339fe3fbf8a94fdd44969f9829ce29ea83128e83d84157e51588a55fc02dbaac5a47"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-WizardModule-702a692e70ffcc7aba99ebe1e16df24223e210b0ec111622d0a14ce68668339fe3fbf8a94fdd44969f9829ce29ea83128e83d84157e51588a55fc02dbaac5a47"' :
                                            'id="xs-components-links-module-WizardModule-702a692e70ffcc7aba99ebe1e16df24223e210b0ec111622d0a14ce68668339fe3fbf8a94fdd44969f9829ce29ea83128e83d84157e51588a55fc02dbaac5a47"' }>
                                            <li class="link">
                                                <a href="components/WizardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WizardComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-WizardModule-702a692e70ffcc7aba99ebe1e16df24223e210b0ec111622d0a14ce68668339fe3fbf8a94fdd44969f9829ce29ea83128e83d84157e51588a55fc02dbaac5a47"' : 'data-bs-target="#xs-directives-links-module-WizardModule-702a692e70ffcc7aba99ebe1e16df24223e210b0ec111622d0a14ce68668339fe3fbf8a94fdd44969f9829ce29ea83128e83d84157e51588a55fc02dbaac5a47"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-WizardModule-702a692e70ffcc7aba99ebe1e16df24223e210b0ec111622d0a14ce68668339fe3fbf8a94fdd44969f9829ce29ea83128e83d84157e51588a55fc02dbaac5a47"' :
                                        'id="xs-directives-links-module-WizardModule-702a692e70ffcc7aba99ebe1e16df24223e210b0ec111622d0a14ce68668339fe3fbf8a94fdd44969f9829ce29ea83128e83d84157e51588a55fc02dbaac5a47"' }>
                                        <li class="link">
                                            <a href="directives/WizardDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WizardDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/OpenTracingHttpInterceptor.html" data-type="entity-link" >OpenTracingHttpInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="classes/Validation.html" data-type="entity-link" >Validation</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IncompleteDateService.html" data-type="entity-link" >IncompleteDateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SecurityService.html" data-type="entity-link" >SecurityService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserInfoService.html" data-type="entity-link" >UserInfoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WidgetsConfigService.html" data-type="entity-link" >WidgetsConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ZipkinOpenTracingHttpInterceptor.html" data-type="entity-link" >ZipkinOpenTracingHttpInterceptor</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interceptors-links"' :
                            'data-bs-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/CorrelationIdHttpInterceptor.html" data-type="entity-link" >CorrelationIdHttpInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/DateObject.html" data-type="entity-link" >DateObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PermissionMaps.html" data-type="entity-link" >PermissionMaps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserInfo.html" data-type="entity-link" >UserInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WidgetsTranslation.html" data-type="entity-link" >WidgetsTranslation</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});