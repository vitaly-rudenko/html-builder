const { stripIndent } = require('common-tags');
const HtmlTag = require('../../app/builder/HtmlTag');
const Newline = require('../../app/builder/Newline');

describe('HtmlTag', () => {
    const INDENTATION = '    ';

    describe('render()', () => {
        it('should render empty elements', () => {
            expect(
                HtmlTag.create('div').render(INDENTATION)
            ).toBe('<div />');
            
            expect(
                HtmlTag.create('span').render(INDENTATION)
            ).toBe('<span />');
        });

        it('should render attributes', () => {
            expect(
                HtmlTag.create('div').attribute('test', true).render(INDENTATION)
            ).toBe('<div test="true" />');

            expect(
                HtmlTag.create('span').attribute('hello-world', 'jon snow').render(INDENTATION)
            ).toBe('<span hello-world="jon snow" />');

            expect(
                HtmlTag.create('p').attribute('data-id', 146).render(INDENTATION)
            ).toBe('<p data-id="146" />');
        });

        it('should render children (basic)', () => {
            expect(
                HtmlTag.create('div').children('hello world').render(INDENTATION)
            ).toBe('<div>hello world</div>');

            expect(
                HtmlTag.create('span').children(146).render(INDENTATION)
            ).toBe('<span>146</span>');

            expect(
                HtmlTag.create('p').children(true).render(INDENTATION)
            ).toBe('<p>true</p>');
        });

        it('should render children (complex)', () => {
            expect(
                HtmlTag.create('div').children([
                    'hello',
                    'world',
                    '!'
                ]).render(INDENTATION)
            ).toBe(stripIndent`
                <div>helloworld!</div>
            `);

            expect(
                HtmlTag.create('div').children([
                    'hello',
                    Newline.create(),
                    'world',
                    '!'
                ]).render(INDENTATION)
            ).toBe(stripIndent`
                <div>
                    hello
                    world!
                </div>
            `);

            expect(
                HtmlTag.create('div').children([
                    HtmlTag.create('div').children('Hello world!')
                ]).render(INDENTATION)
            ).toBe(stripIndent`
                <div>
                    <div>Hello world!</div>
                </div>
            `);

            expect(
                HtmlTag.create('div').children([
                    HtmlTag.create('div').children('Hello'),
                    'world!'
                ]).render(INDENTATION)
            ).toBe(stripIndent`
                <div>
                    <div>Hello</div>world!
                </div>
            `);

            expect(
                HtmlTag.create('div').children([
                    HtmlTag.create('div').children([
                        HtmlTag.create('div').children([
                            HtmlTag.create('div').children([
                                'Hello world!'
                            ])
                        ])
                    ])
                ]).render(INDENTATION)
            ).toBe(stripIndent`
                <div>
                    <div>
                        <div>
                            <div>Hello world!</div>
                        </div>
                    </div>
                </div>
            `);

            expect(
                HtmlTag.create('div').children([
                    HtmlTag.create('span'),
                    HtmlTag.create('p').attribute('data-id', 'fake-id'),
                    HtmlTag.create('div').attribute('class', 'my-class').children([
                        HtmlTag.create('span').children('Hi!'),
                        HtmlTag.create('br'),
                        Newline.create(),
                        HtmlTag.create('span').children('Hello'),
                        '_',
                        HtmlTag.create('span').children('world'),
                        '!'
                    ])
                ]).render(INDENTATION)
            ).toBe(stripIndent`
                <div>
                    <span /><p data-id="fake-id" /><div class="my-class">
                        <span>Hi!</span><br />
                        <span>Hello</span>_<span>world</span>!
                    </div>
                </div>
            `);

            expect(
                HtmlTag.create('div').children([
                    HtmlTag.create('span'),
                    HtmlTag.create('p').attribute('data-id', 'fake-id'),
                    Newline.create(),
                    HtmlTag.create('div').attribute('class', 'my-class').children([
                        HtmlTag.create('span').children('Hi!'),
                        HtmlTag.create('br'),
                        Newline.create(),
                        HtmlTag.create('span').children('Hello'),
                        '_',
                        HtmlTag.create('span').children('world'),
                        '!'
                    ])
                ]).render(INDENTATION)
            ).toBe(stripIndent`
                <div>
                    <span /><p data-id="fake-id" />
                    <div class="my-class">
                        <span>Hi!</span><br />
                        <span>Hello</span>_<span>world</span>!
                    </div>
                </div>
            `);
        });
    });
});
