const utils = require('./utils');

describe('test', () => {
    it('getDescription', () => {
        const markdownData = {
            meta: {},
            content: [
                'article',
                {
                    position: {
                        start: {
                            column: 1,
                            line: 2,
                            offset: 1,
                        },
                        end: {
                            column: 4,
                            line: 5,
                            offset: 35,
                        },
                        indent: [1, 1, 1],
                    },
                    type: 'yaml',
                    value: `title: Button
subtitle: 按钮`,
                },
                [
                    'section',
                    [
                        'p',
                        '这是按钮',
                    ],
                    [
                        'p',
                        '开始我们的正文内容',
                    ],
                ],
            ],
        };
        const result = utils.getDescription(markdownData);

        expect(result).toEqual({
            meta: {},
            content: [
                'article',
                {
                    position: {
                        start: {
                            column: 1,
                            line: 2,
                            offset: 1,
                        },
                        end: {
                            column: 4,
                            line: 5,
                            offset: 35,
                        },
                        indent: [1, 1, 1],
                    },
                    type: 'yaml',
                    value: `title: Button
subtitle: 按钮`,
                },
                [
                    'p',
                    '开始我们的正文内容',
                ],
            ],
            description: [
                'section',
                [
                    'p',
                    '这是按钮',
                ],
            ],
        });
    });
});
