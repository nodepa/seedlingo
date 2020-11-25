#!/usr/bin/env ruby

#############################################
# Pretty print data from AnkiApp json files #
#############################################

# ./pretty.rb fileIn.json fileOut.json

fromFilename = ARGV[0]
toFilename = ARGV[1]

def prettyPrintJson(fromFilename, toFilename)
  p "From '#{fromFilename}' to '#{toFilename}'"
  if File.file?(fromFilename)
    p "Parsing file: '#{fromFilename}'"

    File.open(fromFilename, 'r') do |inFile|
      File.open(toFilename, 'w') do |outFile|
        indent = 0
        while char = inFile.read(1)
          if ['[', '{', ','].include? char
            indent += 1 if char != ','
            outFile.write(char + "\n" + '  ' * indent)
          elsif [']', '}'].include? char
            indent -= 1
            outFile.write("\n" + '  ' * indent + char)
          else
            outFile.write(char)
          end
        end
      end
    end
  end
end

prettyPrintJson(fromFilename, toFilename)
