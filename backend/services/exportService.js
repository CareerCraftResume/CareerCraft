const puppeteer = require('puppeteer');
const { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } = require('docx');
const htmlPdf = require('html-pdf-node');
const Handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

class ExportService {
    constructor() {
        this.templatesDir = path.join(__dirname, '../templates/export');
        this.tempDir = path.join(__dirname, '../temp');
    }

    async initialize() {
        try {
            await fs.mkdir(this.tempDir, { recursive: true });
        } catch (error) {
            console.error('Error creating temp directory:', error);
        }
    }

    // Generate PDF using html-pdf-node (lightweight, good for simple resumes)
    async generateSimplePDF(resume, template) {
        try {
            const htmlTemplate = await fs.readFile(
                path.join(this.templatesDir, 'resume.hbs'),
                'utf-8'
            );
            
            const compiledTemplate = Handlebars.compile(htmlTemplate);
            const html = compiledTemplate({ resume, template });
            
            const options = {
                format: 'A4',
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px'
                }
            };
            
            const file = { content: html };
            const buffer = await htmlPdf.generatePdf(file, options);
            
            return buffer;
        } catch (error) {
            console.error('Error generating simple PDF:', error);
            throw error;
        }
    }

    // Generate PDF using Puppeteer (better for complex layouts and styling)
    async generatePDF(resume, template) {
        let browser = null;
        try {
            const htmlTemplate = await fs.readFile(
                path.join(this.templatesDir, 'resume.hbs'),
                'utf-8'
            );
            
            const compiledTemplate = Handlebars.compile(htmlTemplate);
            const html = compiledTemplate({ resume, template });
            
            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox']
            });
            
            const page = await browser.newPage();
            await page.setContent(html, {
                waitUntil: 'networkidle0'
            });
            
            const pdf = await page.pdf({
                format: 'A4',
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px'
                },
                printBackground: true
            });
            
            return pdf;
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }

    // Generate Word document
    async generateWord(resume) {
        try {
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        // Header with name and contact info
                        new Paragraph({
                            text: resume.basics.name,
                            heading: HeadingLevel.HEADING_1
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${resume.basics.email} | ${resume.basics.phone}`,
                                    size: 24
                                })
                            ]
                        }),
                        
                        // Professional Summary
                        ...this._generateSection('Professional Summary', [resume.basics.summary]),
                        
                        // Experience Section
                        ...this._generateExperienceSection(resume.experience),
                        
                        // Education Section
                        ...this._generateEducationSection(resume.education),
                        
                        // Skills Section
                        ...this._generateSkillsSection(resume.skills)
                    ]
                }]
            });
            
            const buffer = await this._generateWordBuffer(doc);
            return buffer;
        } catch (error) {
            console.error('Error generating Word document:', error);
            throw error;
        }
    }

    // Helper method to generate Word document sections
    _generateSection(title, content) {
        const paragraphs = [
            new Paragraph({
                text: title,
                heading: HeadingLevel.HEADING_2,
                spacing: {
                    before: 400,
                    after: 200
                }
            })
        ];

        content.forEach(text => {
            paragraphs.push(
                new Paragraph({
                    text: text,
                    spacing: {
                        before: 100,
                        after: 100
                    }
                })
            );
        });

        return paragraphs;
    }

    // Helper method to generate experience section for Word
    _generateExperienceSection(experience) {
        const paragraphs = [
            new Paragraph({
                text: 'Professional Experience',
                heading: HeadingLevel.HEADING_2,
                spacing: {
                    before: 400,
                    after: 200
                }
            })
        ];

        experience.forEach(job => {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: job.company,
                            bold: true
                        }),
                        new TextRun({
                            text: ` | ${job.position}`,
                            italics: true
                        })
                    ]
                }),
                new Paragraph({
                    text: `${job.startDate} - ${job.endDate || 'Present'}`,
                    spacing: {
                        before: 100
                    }
                }),
                new Paragraph({
                    text: job.description,
                    spacing: {
                        before: 100,
                        after: 200
                    }
                })
            );
        });

        return paragraphs;
    }

    // Helper method to generate education section for Word
    _generateEducationSection(education) {
        const paragraphs = [
            new Paragraph({
                text: 'Education',
                heading: HeadingLevel.HEADING_2,
                spacing: {
                    before: 400,
                    after: 200
                }
            })
        ];

        education.forEach(edu => {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: edu.institution,
                            bold: true
                        }),
                        new TextRun({
                            text: ` | ${edu.degree}`,
                            italics: true
                        })
                    ]
                }),
                new Paragraph({
                    text: `${edu.startDate} - ${edu.endDate || 'Present'}`,
                    spacing: {
                        before: 100,
                        after: 100
                    }
                })
            );

            if (edu.achievements) {
                paragraphs.push(
                    new Paragraph({
                        text: edu.achievements,
                        spacing: {
                            before: 100,
                            after: 200
                        }
                    })
                );
            }
        });

        return paragraphs;
    }

    // Helper method to generate skills section for Word
    _generateSkillsSection(skills) {
        const paragraphs = [
            new Paragraph({
                text: 'Skills',
                heading: HeadingLevel.HEADING_2,
                spacing: {
                    before: 400,
                    after: 200
                }
            })
        ];

        skills.forEach(skillCategory => {
            paragraphs.push(
                new Paragraph({
                    text: skillCategory.category,
                    bold: true,
                    spacing: {
                        before: 200
                    }
                }),
                new Paragraph({
                    text: skillCategory.items.join(', '),
                    spacing: {
                        before: 100,
                        after: 200
                    }
                })
            );
        });

        return paragraphs;
    }

    // Helper method to generate Word buffer
    async _generateWordBuffer(doc) {
        return await doc.save();
    }

    // Clean up temporary files
    async cleanup() {
        try {
            const files = await fs.readdir(this.tempDir);
            await Promise.all(
                files.map(file => 
                    fs.unlink(path.join(this.tempDir, file))
                )
            );
        } catch (error) {
            console.error('Error cleaning up temp files:', error);
        }
    }
}

module.exports = new ExportService();
