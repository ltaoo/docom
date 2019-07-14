const utils = require('./utils');

describe('test', () => {
    it('toc', () => {
        const markdownData = {
            meta: {
                title: 'Button',
                subtitle: '按钮',
            },
            content: [
                'article',
                [
                    'p',
                    '这是按钮',
                ],
                [
                    'hr',
                ],
                [
                    'p',
                    '开始我们的正文内容',
                ],
                [
                    'h2',
                    'h2',
                ],
                [
                    'p',
                    '这是次级标题',
                ],
            ],
        };
        const result = utils.toc(markdownData, { maxDepth: 6 });

        expect(result).toEqual({
            meta: {
                title: 'Button',
                subtitle: '按钮',
            },
            content: [
                'article',
                [
                    'p',
                    '这是按钮',
                ],
                [
                    'hr',
                ],
                [
                    'p',
                    '开始我们的正文内容',
                ],
                [
                    'h2',
                    'h2',
                ],
                [
                    'p',
                    '这是次级标题',
                ],
            ],
            toc: [
                'ul',
                [
                    'li',
                    [
                        'a',
                        {
                            className: 'bisheng-toc-h2',
                            href: '#h2',
                            title: 'h2',
                        },
                        'h2',
                    ],
                ],
            ],
        });
    });
});
